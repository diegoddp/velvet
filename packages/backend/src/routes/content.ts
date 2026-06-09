import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { authenticateToken, requireCreator, AuthenticatedRequest } from '../middleware/auth';
import { validatePrice } from '../utils/validation';

const router = Router();

// Upload content (creator only)
router.post('/upload', authenticateToken, requireCreator, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const creatorId = req.userId!;
    const { 
      title, 
      description, 
      mediaUrl, 
      thumbnail, 
      type, 
      accessType, 
      price, 
      requiredTierId,
      consentFormUrl,
      creatorDeclaresLegality
    } = req.body;

    // Validation
    if (!title || !mediaUrl || !type || !accessType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['PHOTO', 'VIDEO'].includes(type.toUpperCase())) {
      return res.status(400).json({ error: 'Invalid content type' });
    }

    if (!['FREE', 'SUBSCRIPTION', 'PAID'].includes(accessType.toUpperCase())) {
      return res.status(400).json({ error: 'Invalid access type' });
    }

    if (accessType === 'PAID' && (!price || !validatePrice(price))) {
      return res.status(400).json({ error: 'Invalid price' });
    }

    if (!consentFormUrl || !creatorDeclaresLegality) {
      return res.status(400).json({ 
        error: 'Consent form and legality declaration required for all content' 
      });
    }

    // Create content with pending moderation
    const content = await prisma.content.create({
      data: {
        creatorId,
        title,
        description,
        mediaUrl,
        thumbnail,
        type: type.toUpperCase(),
        accessType: accessType.toUpperCase(),
        price: price || 0,
        requiredTierId,
        consentFormUrl,
        consentFormSignedAt: new Date(),
        creatorDeclaresLegality,
        moderationStatus: 'PENDING'
      }
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: creatorId,
        action: 'content_uploaded',
        entityType: 'Content',
        entityId: content.id
      }
    });

    res.status(201).json({
      message: 'Content uploaded. Pending moderation review.',
      content: {
        id: content.id,
        title: content.title,
        moderationStatus: content.moderationStatus
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload content' });
  }
});

// Get content details
router.get('/:contentId', async (req: Request, res: Response) => {
  try {
    const { contentId } = req.params;

    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            isVerified: true,
            creatorProfile: {
              select: {
                verifiedBadge: true,
                followerCount: true
              }
            }
          }
        }
      }
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    if (content.moderationStatus === 'REMOVED' && !req.headers['authorization']) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Increment view count
    await prisma.content.update({
      where: { id: contentId },
      data: { viewCount: { increment: 1 } }
    });

    res.json(content);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Get creator's content feed
router.get('/creator/:creatorId/feed', async (req: Request, res: Response) => {
  try {
    const { creatorId } = req.params;
    const { skip = 0, limit = 20 } = req.query;

    const content = await prisma.content.findMany({
      where: {
        creatorId,
        isVisible: true,
        moderationStatus: 'APPROVED'
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip as string),
      take: parseInt(limit as string),
      include: {
        creator: {
          select: {
            username: true,
            profileImage: true,
            isVerified: true
          }
        }
      }
    });

    const total = await prisma.content.count({
      where: {
        creatorId,
        isVisible: true,
        moderationStatus: 'APPROVED'
      }
    });

    res.json({
      content,
      pagination: {
        total,
        skip: parseInt(skip as string),
        limit: parseInt(limit as string)
      }
    });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

// Delete content (creator only)
router.delete('/:contentId', authenticateToken, requireCreator, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const creatorId = req.userId!;
    const { contentId } = req.params;

    const content = await prisma.content.findUnique({ where: { id: contentId } });

    if (!content || content.creatorId !== creatorId) {
      return res.status(403).json({ error: 'Not authorized to delete this content' });
    }

    await prisma.content.update({
      where: { id: contentId },
      data: { isVisible: false }
    });

    await prisma.auditLog.create({
      data: {
        userId: creatorId,
        action: 'content_deleted',
        entityType: 'Content',
        entityId: contentId
      }
    });

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

// Search content
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q, creatorId, type, skip = 0, limit = 20 } = req.query;

    let where: any = {
      isVisible: true,
      moderationStatus: 'APPROVED'
    };

    if (q) {
      where.OR = [
        { title: { contains: q as string, mode: 'insensitive' } },
        { description: { contains: q as string, mode: 'insensitive' } }
      ];
    }

    if (creatorId) {
      where.creatorId = creatorId;
    }

    if (type) {
      where.type = (type as string).toUpperCase();
    }

    const content = await prisma.content.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip as string),
      take: parseInt(limit as string)
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
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
