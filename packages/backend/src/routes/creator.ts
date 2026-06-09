import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { authenticateToken, requireCreator, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get creator profile with stats
router.get('/:creatorId', async (req: Request, res: Response) => {
  try {
    const { creatorId } = req.params;

    const creator = await prisma.creatorProfile.findUnique({
      where: { userId: creatorId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            username: true,
            bio: true,
            profileImage: true,
            isVerified: true,
            createdAt: true
          }
        },
        subscriptionTiers: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    res.json(creator);
  } catch (error) {
    console.error('Get creator error:', error);
    res.status(500).json({ error: 'Failed to fetch creator' });
  }
});

// Submit KYC for creator verification
router.post('/kyc/submit', authenticateToken, requireCreator, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { idDocumentUrl, selfieUrl } = req.body;

    if (!idDocumentUrl || !selfieUrl) {
      return res.status(400).json({ error: 'ID document and selfie are required' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        kycStatus: 'SUBMITTED',
        kycDocument: idDocumentUrl,
        kycselfieImage: selfieUrl
      }
    });

    // Log for audit
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'kyc_submitted',
        entityType: 'User',
        entityId: userId
      }
    });

    res.json({
      message: 'KYC submitted successfully. Admin review in progress.',
      kycStatus: user.kycStatus
    });
  } catch (error) {
    console.error('KYC submission error:', error);
    res.status(500).json({ error: 'Failed to submit KYC' });
  }
});

// Get KYC status
router.get('/kyc/status', authenticateToken, requireCreator, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        kycStatus: true,
        verificationStatus: true,
        isVerified: true,
        kycApprovedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get KYC status error:', error);
    res.status(500).json({ error: 'Failed to fetch KYC status' });
  }
});

// Create subscription tier
router.post('/tiers', authenticateToken, requireCreator, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { name, description, price, frequency } = req.body;

    // Get creator profile
    const creatorProfile = await prisma.creatorProfile.findUnique({
      where: { userId }
    });

    if (!creatorProfile) {
      return res.status(404).json({ error: 'Creator profile not found' });
    }

    if (!name || price <= 0 || price > 1000) {
      return res.status(400).json({ error: 'Invalid tier data' });
    }

    if (!['monthly', 'quarterly', 'annual'].includes(frequency)) {
      return res.status(400).json({ error: 'Invalid frequency' });
    }

    const tier = await prisma.subscriptionTier.create({
      data: {
        creatorProfileId: creatorProfile.id,
        name,
        description,
        price,
        frequency,
        order: 0
      }
    });

    res.status(201).json({
      message: 'Subscription tier created',
      tier
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Tier name already exists' });
    }
    console.error('Create tier error:', error);
    res.status(500).json({ error: 'Failed to create tier' });
  }
});

// Get creator's subscription tiers
router.get('/:creatorId/tiers', async (req: Request, res: Response) => {
  try {
    const { creatorId } = req.params;

    const creatorProfile = await prisma.creatorProfile.findUnique({
      where: { userId: creatorId }
    });

    if (!creatorProfile) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    const tiers = await prisma.subscriptionTier.findMany({
      where: {
        creatorProfileId: creatorProfile.id,
        isActive: true
      },
      orderBy: { order: 'asc' }
    });

    res.json(tiers);
  } catch (error) {
    console.error('Get tiers error:', error);
    res.status(500).json({ error: 'Failed to fetch tiers' });
  }
});

// Update subscription tier
router.put('/tiers/:tierId', authenticateToken, requireCreator, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { tierId } = req.params;
    const { name, description, price, frequency } = req.body;

    // Verify ownership
    const tier = await prisma.subscriptionTier.findUnique({
      where: { id: tierId },
      include: { creatorProfile: true }
    });

    if (!tier || tier.creatorProfile.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this tier' });
    }

    const updated = await prisma.subscriptionTier.update({
      where: { id: tierId },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price }),
        ...(frequency && { frequency })
      }
    });

    res.json({
      message: 'Tier updated successfully',
      tier: updated
    });
  } catch (error) {
    console.error('Update tier error:', error);
    res.status(500).json({ error: 'Failed to update tier' });
  }
});

// Get creator's earnings and stats
router.get('/:creatorId/stats', async (req: Request, res: Response) => {
  try {
    const { creatorId } = req.params;

    const creatorProfile = await prisma.creatorProfile.findUnique({
      where: { userId: creatorId },
      include: {
        _count: {
          select: {
            subscriptions: true
          }
        }
      }
    });

    if (!creatorProfile) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    // Get content count
    const contentCount = await prisma.content.count({
      where: { creatorId }
    });

    // Get total earnings from transactions
    const earnings = await prisma.walletTransaction.aggregate({
      where: {
        userId: creatorId,
        type: 'EARNINGS_DEPOSIT'
      },
      _sum: { amount: true }
    });

    res.json({
      creatorId,
      followerCount: creatorProfile.followerCount,
      contentCount,
      activeSubscribers: creatorProfile._count.subscriptions,
      totalEarnings: earnings._sum.amount || 0,
      averageRating: creatorProfile.averageRating,
      verifiedBadge: creatorProfile.verifiedBadge
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
