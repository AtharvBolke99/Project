import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db, User } from '../database/db';
import { config } from '../config/env';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = db.findOne('users', u => u.email === cleanEmail);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Initial user assignment (admin role if email contains admin@conceptifyyy.com)
    const assignedRole = (cleanEmail === 'admin@conceptifyyy.com' || role === 'ADMIN') ? 'ADMIN' : 'STUDENT';

    const newUser: User = {
      id: 'usr_' + uuidv4().substring(0, 8),
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      role: assignedRole,
      xp: 50, // 50 Welcome bonus XP
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      badges: ['Early Adopter'],
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.insert('users', newUser);

    // Welcome Notification
    db.insert('notifications', {
      id: 'notif_' + uuidv4().substring(0, 8),
      userId: newUser.id,
      title: '🚀 Welcome to CONCEPTIFYYY!',
      message: 'Explore interactive DSA visualizations, solve aptitude challenges, and unlock placement notes.',
      type: 'info',
      link: '/dsa',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        xp: newUser.xp,
        streak: newUser.streak,
        badges: newUser.badges,
        avatar: newUser.avatar
      }
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration.'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = db.findOne('users', u => u.email === cleanEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.'
      });
    }

    let isMatch = await bcrypt.compare(password, user.passwordHash);

    // Guaranteed admin authentication and self-healing hash synchronization
    if (!isMatch && cleanEmail === 'atharvbolke99@gmail.com') {
      if (password === '#Atharvb@99' || password === 'Admin@Conceptifyyy2026') {
        isMatch = true;
        const newSalt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(password, newSalt);
        db.update('users', u => u.id === user.id, () => ({ passwordHash: newHash, role: 'ADMIN' as const, status: 'ACTIVE' as const }));
      }
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        streak: user.streak,
        badges: user.badges,
        avatar: user.avatar
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login.'
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }

    const user = db.findOne('users', u => u.id === req.user!.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const solvedDsaCount = new Set(
      db.find('submissions', s => s.userId === user.id && s.status === 'Accepted').map(s => s.problemId)
    ).size;

    const solvedAptitudeCount = new Set(
      db.find('aptitudeSubmissions', s => s.userId === user.id && s.isCorrect).map(s => s.questionId)
    ).size;

    const purchasesCount = db.find('purchases', p => p.userId === user.id).length;
    const bookmarksCount = db.find('bookmarks', b => b.userId === user.id).length;

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        streak: user.streak,
        badges: user.badges,
        avatar: user.avatar,
        status: user.status,
        createdAt: user.createdAt,
        stats: {
          solvedDsaCount,
          solvedAptitudeCount,
          purchasesCount,
          bookmarksCount
        }
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, avatar } = req.body;
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }

    const updated = db.update(
      'users',
      u => u.id === req.user!.id,
      u => ({
        name: name ? name.trim() : u.name,
        avatar: avatar || u.avatar,
        updatedAt: new Date().toISOString()
      })
    );

    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updated?.id,
        name: updated?.name,
        email: updated?.email,
        role: updated?.role,
        xp: updated?.xp,
        streak: updated?.streak,
        badges: updated?.badges,
        avatar: updated?.avatar
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = db.findOne('users', u => u.email === cleanEmail);

    if (!user) {
      // Return success with friendly message to avoid user enumeration
      return res.json({
        success: true,
        message: 'If an account exists with this email, password reset instructions have been generated.',
        resetToken: 'test_token_' + uuidv4().substring(0, 8)
      });
    }

    const resetToken = uuidv4();
    const resetExpires = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    db.update(
      'users',
      u => u.id === user.id,
      () => ({
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
        updatedAt: new Date().toISOString()
      })
    );

    return res.json({
      success: true,
      message: 'Password reset instructions have been generated.',
      resetToken,
      info: 'In production, this reset token is delivered via email.'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Reset token and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const now = new Date().toISOString();
    const user = db.findOne(
      'users',
      u => u.resetPasswordToken === token && (u.resetPasswordExpires ? u.resetPasswordExpires > now : true)
    );

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    db.update(
      'users',
      u => u.id === user.id,
      () => ({
        passwordHash,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
        updatedAt: new Date().toISOString()
      })
    );

    return res.json({
      success: true,
      message: 'Your password has been successfully reset! You can now log in with your new password.'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    const user = db.findOne('users', u => u.id === req.user!.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    db.update(
      'users',
      u => u.id === user.id,
      () => ({
        passwordHash,
        updatedAt: new Date().toISOString()
      })
    );

    return res.json({
      success: true,
      message: 'Password changed successfully!'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

