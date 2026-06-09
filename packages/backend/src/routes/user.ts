import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get user profile
router.get('/profile/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userType: true,
        ageVerified: true,
        creatorProfile: {
          select: {
            username: true,
            bio: true,
            profileImage: true,
            bannerImage: true,
            isVerified: true,
            followerCount: true,
            rating: true,
            subscriptionTiers: true
          }
        },
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile (authenticated)
router.put('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { firstName, lastName, username, bio, profileImageUrl, bannerImageUrl } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName })
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true
      }
    });

    const creatorProfile = await prisma.creatorProfile.findUnique({ where: { userId } });
    if (creatorProfile) {
      await prisma.creatorProfile.update({
        where: { userId },
        data: {
          ...(username && { username }),
          ...(bio && { bio }),
          ...(profileImageUrl && { profileImage: profileImageUrl }),
          ...(bannerImageUrl && { bannerImage: bannerImageUrl })
        }
      });
    }

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user's own data (authenticated)
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userType: true,
        ageVerified: true,
        ageVerificationDate: true,
        kycStatus: true,
        creatorProfile: {
          select: {
            username: true,
            bio: true,
            profileImage: true,
            bannerImage: true,
            isVerified: true,
            followerCount: true,
            totalEarnings: true,
            rating: true
          }
        },
        createdAt: true,
        lastLogin: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Search users (for follows/messaging)
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || typeof q !== 'string' || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: q } },
          { lastName: { contains: q } },
          { creatorProfile: { is: { username: { contains: q } } } }
        ],
        isActive: true
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        userType: true,
        ageVerified: true,
        creatorProfile: {
          select: {
            username: true,
            profileImage: true,
            isVerified: true,
            followerCount: true
          }
        }
      },
      take: parseInt(limit as string)
    });

    res.json(users);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Block user
router.post('/block/:userIdToBlock', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { userIdToBlock } = req.params;

    if (userId === userIdToBlock) {
      return res.status(400).json({ error: 'Cannot block yourself' });
    }

    await prisma.blockedUser.create({
      data: {
        blockingUserId: userId,
        blockedUserId: userIdToBlock,
        reason: req.body.reason
      }
    });

    res.json({ message: 'User blocked successfully' });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'User already blocked' });
    }
    console.error('Block user error:', error);
    res.status(500).json({ error: 'Failed to block user' });
  }
});

// Unblock user
router.delete('/block/:userIdToUnblock', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { userIdToUnblock } = req.params;

    await prisma.blockedUser.deleteMany({
      where: {
        blockingUserId: userId,
        blockedUserId: userIdToUnblock
      }
    });

    res.json({ message: 'User unblocked successfully' });
  } catch (error) {
    console.error('Unblock user error:', error);
    res.status(500).json({ error: 'Failed to unblock user' });
  }
});

// Get blocked users list
router.get('/blocked-list', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const blockedUsers = await prisma.blockedUser.findMany({
      where: { blockingUserId: userId },
      include: {
        blockedUser: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            userType: true,
            creatorProfile: {
              select: {
                username: true,
                profileImage: true
              }
            }
          }
        }
      }
    });

    res.json(blockedUsers);
  } catch (error) {
    console.error('Get blocked list error:', error);
    res.status(500).json({ error: 'Failed to fetch blocked list' });
  }
});

export default router;
