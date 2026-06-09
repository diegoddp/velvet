import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Send message
router.post('/send', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const senderId = req.userId!;
    const { recipientId, content, isPaid, price } = req.body;

    if (!recipientId || !content) {
      return res.status(400).json({ error: 'Recipient and message content required' });
    }

    if (senderId === recipientId) {
      return res.status(400).json({ error: 'Cannot message yourself' });
    }

    // Check if users have blocked each other
    const blocked = await prisma.blockedUser.findFirst({
      where: {
        OR: [
          { blockerId: senderId, blockedUserId: recipientId },
          { blockerId: recipientId, blockedUserId: senderId }
        ]
      }
    });

    if (blocked) {
      return res.status(403).json({ error: 'Cannot send message to this user' });
    }

    // Verify recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId }
    });

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Handle paid messages
    if (isPaid && price) {
      if (price <= 0 || price > 1000) {
        return res.status(400).json({ error: 'Invalid price' });
      }

      // Process payment (simplified - actual payment would involve payment gateway)
      await prisma.walletTransaction.create({
        data: {
          userId: senderId,
          type: 'MESSAGE_PAYMENT',
          amount: price,
          description: `Paid message to ${recipient.username}`
        }
      });
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        recipientId,
        content,
        isPaid,
        price: isPaid ? price : undefined
      }
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: senderId,
        action: 'message_sent',
        entityType: 'Message',
        entityId: message.id
      }
    });

    res.status(201).json({
      message: 'Message sent',
      data: {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get conversation
router.get('/conversation/:otherUserId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { otherUserId } = req.params;
    const { skip = 0, limit = 50 } = req.query;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, recipientId: otherUserId },
          { senderId: otherUserId, recipientId: userId }
        ]
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip as string),
      take: parseInt(limit as string),
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profileImage: true
          }
        }
      }
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        recipientId: userId,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    res.json({
      messages: messages.reverse(),
      pagination: {
        skip: parseInt(skip as string),
        limit: parseInt(limit as string)
      }
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Get inbox/conversations list
router.get('/inbox', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;

    // Get recent conversations
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { recipientId: userId }
        ]
      },
      orderBy: { createdAt: 'desc' },
      distinct: ['senderId', 'recipientId']
    });

    // Get unique users from conversations
    const conversationUserIds = new Set<string>();
    messages.forEach((msg: { senderId: string; recipientId: string }) => {
      if (msg.senderId !== userId) {
        conversationUserIds.add(msg.senderId);
      }
      if (msg.recipientId !== userId) {
        conversationUserIds.add(msg.recipientId);
      }
    });

    // Get user details
    const conversations = await Promise.all(
      Array.from(conversationUserIds).map(async (otherUserId) => {
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: userId, recipientId: otherUserId },
              { senderId: otherUserId, recipientId: userId }
            ]
          },
          orderBy: { createdAt: 'desc' }
        });

        const unreadCount = await prisma.message.count({
          where: {
            senderId: otherUserId,
            recipientId: userId,
            isRead: false
          }
        });

        const user = await prisma.user.findUnique({
          where: { id: otherUserId },
          select: {
            id: true,
            username: true,
            profileImage: true,
            userType: true
          }
        });

        return {
          user,
          lastMessage,
          unreadCount
        };
      })
    );

    res.json(conversations);
  } catch (error) {
    console.error('Get inbox error:', error);
    res.status(500).json({ error: 'Failed to fetch inbox' });
  }
});

// Mark message as read
router.put('/:messageId/read', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { messageId } = req.params;

    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message || message.recipientId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Delete message
router.delete('/:messageId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { messageId } = req.params;

    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message || (message.senderId !== userId && message.recipientId !== userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Don't actually delete - just mark as deleted by changing content
    // This preserves records for dispute resolution
    await prisma.message.update({
      where: { id: messageId },
      data: { content: '[deleted]' }
    });

    res.json({ message: 'Message deleted' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
