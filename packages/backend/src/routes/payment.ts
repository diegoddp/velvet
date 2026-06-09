import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Initialize payment (CCBill, Verotel, or Brazilian processor)
router.post('/initialize', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { amount, currency = 'BRL', description, type, referenceId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // For demo purposes, simulate payment initialization
    // In production, integrate with actual payment processor API

    const paymentId = 'pay_' + Math.random().toString(36).substring(2, 15);

    // Payment processor redirect URL (example with Verotel)
    const paymentUrl = `${process.env.PAYMENT_GATEWAY_URL || 'https://payment.verotel.com'}/process?payment_id=${paymentId}&amount=${amount}&currency=${currency}`;

    res.json({
      paymentId,
      amount,
      currency,
      description,
      redirectUrl: paymentUrl,
      message: 'Payment initialized. Redirect user to complete payment.'
    });
  } catch (error) {
    console.error('Initialize payment error:', error);
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
});

// Handle payment webhook (from payment processor)
router.post('/webhook/success', async (req: Request, res: Response) => {
  try {
    const { paymentId, userId, amount, currency, type, referenceId } = req.body;

    // Verify webhook signature (implement based on your payment processor)
    // This is a simplified example

    if (!paymentId || !userId || !amount) {
      return res.status(400).json({ error: 'Invalid webhook data' });
    }

    // Create wallet transaction
    const transaction = await prisma.walletTransaction.create({
      data: {
        userId,
        type: type || 'SUBSCRIPTION_PAYMENT',
        amount,
        currency,
        description: 'Payment processed',
        referenceId: paymentId,
        status: 'COMPLETED'
      }
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'payment_processed',
        entityType: 'WalletTransaction',
        entityId: transaction.id
      }
    });

    res.json({
      message: 'Payment recorded successfully',
      transactionId: transaction.id
    });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Get wallet balance
router.get('/wallet/balance', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get transactions summary
    const transactions = await prisma.walletTransaction.aggregate({
      where: { userId },
      _sum: { amount: true }
    });

    const totalTransacted = transactions._sum.amount || 0;

    res.json({
      userId,
      balance: totalTransacted,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Get transaction history
router.get('/transactions/history', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { skip = 0, limit = 50, type } = req.query;

    let where: any = { userId };

    if (type) {
      where.type = type;
    }

    const transactions = await prisma.walletTransaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip as string),
      take: parseInt(limit as string)
    });

    const total = await prisma.walletTransaction.count({ where });

    res.json({
      transactions,
      pagination: {
        total,
        skip: parseInt(skip as string),
        limit: parseInt(limit as string)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Request withdrawal (creator earnings)
router.post('/withdrawal/request', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { amount, bankAccountId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Get user's current balance
    const balance = await prisma.walletTransaction.aggregate({
      where: { userId },
      _sum: { amount: true }
    });

    const currentBalance = balance._sum.amount || 0;

    if (amount > currentBalance) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Create withdrawal transaction
    const withdrawal = await prisma.walletTransaction.create({
      data: {
        userId,
        type: 'EARNINGS_WITHDRAWAL',
        amount: -amount,
        description: 'Withdrawal request',
        status: 'PENDING'
      }
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'withdrawal_requested',
        entityType: 'WalletTransaction',
        entityId: withdrawal.id,
        changes: JSON.stringify({ amount, bankAccountId })
      }
    });

    res.json({
      message: 'Withdrawal request submitted. Processing time: 3-5 business days.',
      withdrawal: {
        id: withdrawal.id,
        amount,
        status: withdrawal.status
      }
    });
  } catch (error) {
    console.error('Withdrawal request error:', error);
    res.status(500).json({ error: 'Failed to process withdrawal request' });
  }
});

// Verify payment (for testing)
router.post('/verify/:paymentId', async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;

    // In production, verify with payment processor
    // This is a demo endpoint

    res.json({
      paymentId,
      status: 'verified',
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

export default router;
