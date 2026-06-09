import { Router, Request, Response } from 'express';
const bcrypt = require('bcryptjs');
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { validateEmail, validatePassword } from '../utils/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Register - both creators and subscribers
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, cpf, userType, phoneNumber } = req.body;

    // Validation
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        error: 'Password must be at least 12 characters with uppercase, lowercase, numbers and special characters'
      });
    }

    if (!cpf || cpf.length !== 11) {
      return res.status(400).json({ error: 'Invalid CPF' });
    }

    if (!userType || !['creator', 'subscriber'].includes(userType.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    const generatedUsername = `${email.split('@')[0]}${Math.random().toString(36).substring(2, 8)}`;

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        firstName,
        lastName,
        cpf,
        phoneNumber,
        userType: userType.toUpperCase()
      }
    });

    // Create creator profile if creator
    if (userType.toUpperCase() === 'CREATOR') {
      await prisma.creatorProfile.create({
        data: {
          userId: user.id,
          username: generatedUsername
        }
      });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'Registration successful. Please complete age verification to continue.',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        ageVerified: user.ageVerified,
        kycStatus: user.kycStatus
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Development fast-path for UI testing without full onboarding flow.
    if (
      process.env.NODE_ENV !== 'production' &&
      email === 'test@admire.local' &&
      password === 'TestPassword123!'
    ) {
      let devUser = await prisma.user.findUnique({ where: { email } });

      if (!devUser) {
        const hashedPassword = await bcrypt.hash(password, 12);
        devUser = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            firstName: 'Test',
            lastName: 'User',
            cpf: '99999999999',
            userType: 'SUBSCRIBER',
            ageVerified: true,
            ageVerificationDate: new Date(),
            isActive: true
          }
        });
      }

      const accessToken = jwt.sign(
        { userId: devUser.id, email: devUser.email, userType: devUser.userType },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      const refreshToken = jwt.sign(
        { userId: devUser.id },
        process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
        { expiresIn: '30d' }
      );

      return res.json({
        message: 'Login successful',
        user: {
          id: devUser.id,
          email: devUser.email,
          firstName: devUser.firstName,
          lastName: devUser.lastName,
          userType: devUser.userType,
          ageVerified: devUser.ageVerified,
          kycStatus: devUser.kycStatus
        },
        accessToken,
        refreshToken
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account has been suspended' });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if verified (age verification required)
    if (!user.ageVerified) {
      return res.status(403).json({
        error: 'Age verification required',
        userId: user.id,
        requiresVerification: true
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        ageVerified: user.ageVerified,
        kycStatus: user.kycStatus
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Request age verification (Persona.com integration example)
router.post('/request-age-verification', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.ageVerified) {
      return res.status(400).json({ error: 'User already age verified' });
    }

    // Initialize Persona verification flow
    // This is a mock example - integrate with Persona.com or similar
    const inquiryId = 'inq_' + Math.random().toString(36).substring(2, 15);
    
    res.json({
      message: 'Age verification requested',
      inquiryId: inquiryId,
      redirectUrl: `${process.env.PERSONA_URL || 'https://verify.persona.com'}?inquiry-id=${inquiryId}`,
      instructions: 'Please complete the age verification by providing a valid ID or using our third-party verification service'
    });
  } catch (error) {
    console.error('Age verification request error:', error);
    res.status(500).json({ error: 'Failed to request age verification' });
  }
});

// Complete age verification (webhook from Persona or manual)
router.post('/verify-age', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { verificationMethod, providerId } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ageVerified: true,
        ageVerificationDate: new Date()
      }
    });

    // Create age verification record
    await prisma.ageVerification.create({
      data: {
        userId: userId,
        provider: verificationMethod || 'MANUAL',
        externalId: providerId,
        status: 'VERIFIED',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      }
    });

    res.json({
      message: 'Age verification completed',
      user: {
        id: user.id,
        email: user.email,
        ageVerifiedAt: user.ageVerificationDate
      }
    });
  } catch (error) {
    console.error('Age verification error:', error);
    res.status(500).json({ error: 'Age verification failed' });
  }
});

// Refresh token
router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret'
    ) as any;

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      accessToken: newAccessToken,
      expiresIn: '24h'
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Logout (optional - token-based auth doesn't require server logout)
router.post('/logout', authenticateToken, async (req: Request, res: Response) => {
  res.json({ message: 'Logout successful' });
});

export default router;
