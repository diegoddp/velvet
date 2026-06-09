import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// File a complaint
router.post('/report', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const reportedBy = req.userId!;
    const { contentId, reason, description, urgency } = req.body;

    if (!contentId || !reason) {
      return res.status(400).json({ error: 'Content ID and reason required' });
    }

    const validReasons = [
      'MINOR_INVOLVED',
      'EXPLOITATION',
      'COERCION',
      'ILLEGAL_CONTENT',
      'COPYRIGHT',
      'FAKE_IDENTITY',
      'SPAM',
      'HARASSMENT',
      'OTHER'
    ];

    if (!validReasons.includes(reason)) {
      return res.status(400).json({ error: 'Invalid reason' });
    }

    // Check if content exists
    const content = await prisma.content.findUnique({
      where: { id: contentId }
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Determine urgency level
    let finalUrgency = 'NORMAL';
    if (reason === 'MINOR_INVOLVED' || reason === 'EXPLOITATION' || reason === 'COERCION') {
      finalUrgency = 'CRITICAL';
    } else if (reason === 'ILLEGAL_CONTENT') {
      finalUrgency = 'HIGH';
    }

    // Create complaint
    const complaint = await prisma.complaint.create({
      data: {
        contentId,
        reportedBy,
        reason,
        description,
        urgency: finalUrgency,
        status: 'OPEN'
      }
    });

    // If critical, immediately flag content for removal
    if (finalUrgency === 'CRITICAL') {
      await prisma.content.update({
        where: { id: contentId },
        data: { moderationStatus: 'FLAGGED' }
      });

      // Log critical complaint
      await prisma.auditLog.create({
        data: {
          userId: reportedBy,
          action: 'critical_complaint_filed',
          entityType: 'Complaint',
          entityId: complaint.id,
          changes: JSON.stringify({ reason, urgency: finalUrgency })
        }
      });
    }

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint: {
        id: complaint.id,
        status: complaint.status,
        urgency: complaint.urgency
      }
    });
  } catch (error) {
    console.error('Report error:', error);
    res.status(500).json({ error: 'Failed to submit complaint' });
  }
});

// Get complaint (admin only - should verify admin role)
router.get('/:complaintId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { complaintId } = req.params;

    // TODO: Add admin role verification

    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      include: {
        content: {
          include: {
            creator: {
              select: {
                id: true,
                username: true,
                email: true
              }
            }
          }
        },
        reporter: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({ error: 'Failed to fetch complaint' });
  }
});

// List complaints (admin only)
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Add admin role verification

    const { status, urgency, skip = 0, limit = 20 } = req.query;

    let where: any = {};

    if (status) {
      where.status = status;
    }

    if (urgency) {
      where.urgency = urgency;
    }

    // Prioritize critical complaints
    const complaints = await prisma.complaint.findMany({
      where,
      orderBy: [
        { urgency: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: parseInt(skip as string),
      take: parseInt(limit as string),
      include: {
        content: {
          select: {
            id: true,
            title: true,
            creatorId: true
          }
        },
        reporter: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    const total = await prisma.complaint.count({ where });

    res.json({
      complaints,
      pagination: {
        total,
        skip: parseInt(skip as string),
        limit: parseInt(limit as string)
      }
    });
  } catch (error) {
    console.error('List complaints error:', error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// Resolve complaint (admin only)
router.put('/:complaintId/resolve', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { complaintId } = req.params;
    const { action, notes } = req.body;

    // TODO: Add admin role verification

    const validActions = ['removed', 'no_action', 'user_banned', 'appeal_pending'];

    if (!action || !validActions.includes(action)) {
      return res.status(400).json({ error: 'Invalid resolution action' });
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId }
    });

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Update complaint
    const updated = await prisma.complaint.update({
      where: { id: complaintId },
      data: {
        status: 'RESOLVED',
        resolutionAction: action,
        investigationNotes: notes,
        resolvedAt: new Date(),
        investigatedBy: req.userId
      }
    });

    // Take action on content
    if (action === 'removed') {
      await prisma.content.update({
        where: { id: complaint.contentId },
        data: {
          moderationStatus: 'REMOVED',
          isVisible: false
        }
      });
    } else if (action === 'user_banned') {
      // Ban the creator
      await prisma.user.update({
        where: { id: complaint.content.creatorId },
        data: {
          isBlocked: true,
          blockedReason: `Banned for violation: ${complaint.reason}`
        }
      });
    }

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: req.userId,
        action: 'complaint_resolved',
        entityType: 'Complaint',
        entityId: complaintId,
        changes: JSON.stringify({ action, notes })
      }
    });

    res.json({
      message: 'Complaint resolved',
      complaint: updated
    });
  } catch (error) {
    console.error('Resolve complaint error:', error);
    res.status(500).json({ error: 'Failed to resolve complaint' });
  }
});

// Appeal complaint resolution
router.post('/:complaintId/appeal', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { complaintId } = req.params;
    const { appealReason } = req.body;

    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId }
    });

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    if (complaint.status === 'APPEALED') {
      return res.status(400).json({ error: 'Already appealed' });
    }

    const updated = await prisma.complaint.update({
      where: { id: complaintId },
      data: {
        status: 'APPEALED',
        investigationNotes: `Appeal: ${appealReason}`
      }
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'complaint_appealed',
        entityType: 'Complaint',
        entityId: complaintId
      }
    });

    res.json({
      message: 'Appeal submitted',
      complaint: updated
    });
  } catch (error) {
    console.error('Appeal error:', error);
    res.status(500).json({ error: 'Failed to submit appeal' });
  }
});

export default router;
