import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get pending content for moderation
router.get('/queue', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Add admin role verification

    const { skip = 0, limit = 20, urgency } = req.query;

    let where: any = {
      moderationStatus: { in: ['PENDING', 'UNDER_REVIEW', 'FLAGGED'] }
    };

    if (urgency === 'critical') {
      where.OR = [
        { containsMinors: true },
        { moderationStatus: 'FLAGGED' }
      ];
    }

    const content = await prisma.content.findMany({
      where,
      orderBy: [
        { moderationStatus: 'desc' },
        { createdAt: 'asc' }
      ],
      skip: parseInt(skip as string),
      take: parseInt(limit as string),
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true
          }
        }
      }
    });

    const total = await prisma.content.count({ where });

    res.json({
      content,
      pagination: {
        total,
        skip: parseInt(skip as string),
        limit: parseInt(limit as string)
      }
    });
  } catch (error) {
    console.error('Get moderation queue error:', error);
    res.status(500).json({ error: 'Failed to fetch moderation queue' });
  }
});

// Review content (moderate)
router.put('/review/:contentId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Add admin role verification

    const { contentId } = req.params;
    const { decision, notes, containsMinors = false } = req.body;

    const validDecisions = ['APPROVED', 'FLAGGED', 'REMOVED'];

    if (!decision || !validDecisions.includes(decision)) {
      return res.status(400).json({ error: 'Invalid decision' });
    }

    const content = await prisma.content.findUnique({
      where: { id: contentId }
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Update content status
    const updated = await prisma.content.update({
      where: { id: contentId },
      data: {
        moderationStatus: decision,
        moderationNotes: notes,
        moderatedAt: new Date(),
        containsMinors,
        isVisible: decision === 'APPROVED'
      }
    });

    // If contains minors, escalate to authorities
    if (containsMinors) {
      await escalateToAuthorities(content);
    }

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: req.userId,
        action: 'content_moderated',
        entityType: 'Content',
        entityId: contentId,
        changes: JSON.stringify({
          decision,
          notes,
          containsMinors
        })
      }
    });

    res.json({
      message: `Content ${decision.toLowerCase()}`,
      content: updated
    });
  } catch (error) {
    console.error('Review content error:', error);
    res.status(500).json({ error: 'Failed to review content' });
  }
});

// Content detection API integration (AWS Rekognition, Google Vision, or adult-specific)
router.post('/analyze/:contentId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Add admin role verification

    const { contentId } = req.params;

    const content = await prisma.content.findUnique({
      where: { id: contentId }
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Integration with content detection API
    // Example: AWS Rekognition, Google Vision, Clarifai, or adult-specific provider
    const analysisResult = await analyzeContentWithAPI(content.mediaUrl);

    // Update content with analysis results
    await prisma.content.update({
      where: { id: contentId },
      data: {
        moderationResult: JSON.stringify(analysisResult),
        moderationStatus: analysisResult.flagged ? 'FLAGGED' : 'UNDER_REVIEW'
      }
    });

    res.json({
      contentId,
      analysisResult,
      recommendation: analysisResult.flagged ? 'Review recommended' : 'Appears compliant'
    });
  } catch (error) {
    console.error('Analyze content error:', error);
    res.status(500).json({ error: 'Failed to analyze content' });
  }
});

// Get moderation statistics
router.get('/stats', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Add admin role verification

    const stats = {
      pending: await prisma.content.count({
        where: { moderationStatus: 'PENDING' }
      }),
      underReview: await prisma.content.count({
        where: { moderationStatus: 'UNDER_REVIEW' }
      }),
      approved: await prisma.content.count({
        where: { moderationStatus: 'APPROVED' }
      }),
      flagged: await prisma.content.count({
        where: { moderationStatus: 'FLAGGED' }
      }),
      removed: await prisma.content.count({
        where: { moderationStatus: 'REMOVED' }
      }),
      totalComplaints: await prisma.complaint.count(),
      openComplaints: await prisma.complaint.count({
        where: { status: 'OPEN' }
      }),
      criticalComplaints: await prisma.complaint.count({
        where: {
          urgency: 'CRITICAL',
          status: 'OPEN'
        }
      })
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get audit logs
router.get('/audit-logs', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Add admin role verification

    const { skip = 0, limit = 100, action, entityType } = req.query;

    let where: any = {};

    if (action) {
      where.action = action;
    }

    if (entityType) {
      where.entityType = entityType;
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip as string),
      take: parseInt(limit as string),
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    const total = await prisma.auditLog.count({ where });

    res.json({
      logs,
      pagination: {
        total,
        skip: parseInt(skip as string),
        limit: parseInt(limit as string)
      }
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// ============ Helper Functions ============

// Simulate content analysis with AI
async function analyzeContentWithAPI(mediaUrl: string) {
  // In production, integrate with:
  // - AWS Rekognition
  // - Google Vision API
  // - Clarifai
  // - Adult content detection API

  // For demo purposes, return mock analysis
  return {
    flagged: Math.random() > 0.8, // 20% chance of flagging
    confidence: Math.random() * 100,
    labels: ['adult', 'explicit'],
    containsMinors: false,
    suggestedAction: 'review'
  };
}

// Escalate content with suspected minors to authorities
async function escalateToAuthorities(content: any) {
  console.log(`[CRITICAL] Escalating content ${content.id} with suspected minors to authorities`);

  // In production, implement:
  // 1. Immediate content removal
  // 2. Auto-notification to NCMEC (National Center for Missing & Exploited Children) or equivalent
  // 3. Creator account suspension
  // 4. Preservation of evidence for law enforcement

  await prisma.auditLog.create({
    data: {
      action: 'content_escalated_to_authorities',
      entityType: 'Content',
      entityId: content.id,
      changes: JSON.stringify({
        reason: 'Suspected minor involvement',
        timestamp: new Date().toISOString()
      })
    }
  });
}

export default router;
