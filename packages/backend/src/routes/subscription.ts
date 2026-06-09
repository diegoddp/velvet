import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Subscribe to a creator tier
router.post('/subscribe', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const subscriberId = req.userId!;
    const { tierId, paymentMethodId } = req.body;

    if (!tierId) {
      return res.status(400).json({ error: 'Tier ID required' });
    }

    // Get tier info
    const tier = await prisma.subscriptionTier.findUnique({
      where: { id: tierId },
      include: { creatorProfile: true }
    });

    if (!tier) {
      return res.status(404).json({ error: 'Tier not found' });
    }

    // Check if already subscribed
    const existing = await prisma.subscription.findUnique({
      where: {
        subscriberId_tierE: {
          subscriberId,
          tierId
        }
      }
    });

    if (existing && existing.status === 'ACTIVE') {
      return res.status(400).json({ error: 'Already subscribed to this tier' });
    }

    // Calculate renewal date based on frequency
    const renewalDate = new Date();
    switch (tier.frequency) {
      case 'monthly':
        renewalDate.setMonth(renewalDate.getMonth() + 1);
        break;
      case 'quarterly':
        renewalDate.setMonth(renewalDate.getMonth() + 3);
        break;
      case 'annual':
        renewalDate.setFullYear(renewalDate.getFullYear() + 1);
        break;
    }

    // Process payment (see payment routes for actual integration)
    const subscription = await prisma.subscription.create({
      data: {
        subscriberId,
        tierId,
        creatorId: tier.creatorProfileId,
        status: 'ACTIVE',
        renewalDate
      }
    });

    // Create transaction record
    await prisma.walletTransaction.create({
      data: {
        userId: subscriberId,
        type: 'SUBSCRIPTION_PAYMENT',
        amount: tier.price,
        description: `Subscription to ${tier.name}`,
        referenceId: subscription.id
      }
    });

    // Update subscriber count
    await prisma.creatorProfile.update({
      where: { id: tier.creatorProfileId },
      data: { followerCount: { increment: 1 } }
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: subscriberId,
        action: 'subscription_created',
        entityType: 'Subscription',
        entityId: subscription.id
      }
    });

    res.status(201).json({
      message: 'Subscription successful',
      subscription: {
        id: subscription.id,
        tierId: subscription.tierId,
        status: subscription.status,
        renewalDate: subscription.renewalDate
      }
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Get user's subscriptions
router.get('/my-subscriptions', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const subscriberId = req.userId!;

    const subscriptions = await prisma.subscription.findMany({
      where: { subscriberId },
      include: {
        tier: true,
        creator: {
          include: {
            user: {
              select: {
                username: true,
                firstName: true,
                lastName: true,
                profileImage: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(subscriptions);
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Cancel subscription
router.post('/:subscriptionId/cancel', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const subscriberId = req.userId!;
    const { subscriptionId } = req.params;

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId }
    });

    if (!subscription || subscription.subscriberId !== subscriberId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date()
      }
    });

    // Decrement follower count
    await prisma.creatorProfile.update({
      where: { id: subscription.creatorId },
      data: { followerCount: { decrement: 1 } }
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: subscriberId,
        action: 'subscription_cancelled',
        entityType: 'Subscription',
        entityId: subscriptionId
      }
    });

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Get creator's subscribers
router.get('/:creatorId/subscribers', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const creatorId = req.userId!;
    const { skip = 0, limit = 20 } = req.query;

    // Verify authorization
    const creator = await prisma.creatorProfile.findUnique({
      where: { userId: creatorId }
    });

    if (!creator) {
      return res.status(403).json({ error: 'Not a creator' });
    }

    const subscribers = await prisma.subscription.findMany({
      where: {
        creatorId: creator.id,
        status: 'ACTIVE'
      },
      include: {
        subscriber: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        },
        tier: {
          select: {
            id: true,
            name: true,
            price: true
          }
        }
      },
      skip: parseInt(skip as string),
      take: parseInt(limit as string)
    });

    const total = await prisma.subscription.count({
      where: {
        creatorId: creator.id,
        status: 'ACTIVE'
      }
    });

    res.json({
      subscribers,
      pagination: {
        total,
        skip: parseInt(skip as string),
        limit: parseInt(limit as string)
      }
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// Purchase individual content
router.post('/purchase/:contentId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const buyerId = req.userId!;
    const { contentId } = req.params;

    const content = await prisma.content.findUnique({
      where: { id: contentId }
    });

    if (!content || content.accessType !== 'PAID') {
      return res.status(400).json({ error: 'Content not available for purchase' });
    }

    // Check if already purchased
    const existing = await prisma.contentPurchase.findUnique({
      where: {
        contentId_buyerId: {
          contentId,
          buyerId
        }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Already purchased this content' });
    }

    // Create purchase
    const purchase = await prisma.contentPurchase.create({
      data: {
        contentId,
        buyerId,
        price: content.price || 0,
        status: 'COMPLETED'
      }
    });

    // Create transaction
    await prisma.walletTransaction.create({
      data: {
        userId: buyerId,
        type: 'CONTENT_PURCHASE',
        amount: content.price || 0,
        description: `Purchased: ${content.title}`,
        referenceId: purchase.id
      }
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: buyerId,
        action: 'content_purchased',
        entityType: 'ContentPurchase',
        entityId: purchase.id
      }
    });

    res.status(201).json({
      message: 'Purchase successful',
      purchase
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'Failed to complete purchase' });
  }
});

export default router;
