import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { memoryStore } from '../config/dataStore.js';

const generateToken = (id, email, name) => {
  const secret = process.env.JWT_SECRET || 'shortly_dev_jwt_secret_key_12345';
  return jwt.sign({ id, email, name }, secret, {
    expiresIn: '30d',
  });
};

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    return next(new Error('Please provide name, email, and password'));
  }

  if (password.length < 6) {
    res.status(400);
    return next(new Error('Password must be at least 6 characters'));
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        res.status(400);
        return next(new Error('A user with that email already exists'));
      }

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      const token = generateToken(user._id, user.email, user.name);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      const userExists = memoryStore.users.find((u) => u.email === email);
      if (userExists) {
        res.status(400);
        return next(new Error('A user with that email already exists'));
      }

      const newUser = {
        _id: 'usr_' + Date.now(),
        name,
        email,
        password: hashedPassword,
      };
      memoryStore.users.push(newUser);

      const token = generateToken(newUser._id, newUser.email, newUser.name);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    return next(new Error('Please provide an email and password'));
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        res.status(401);
        return next(new Error('Invalid email or password'));
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401);
        return next(new Error('Invalid email or password'));
      }

      const token = generateToken(user._id, user.email, user.name);

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      const user = memoryStore.users.find((u) => u.email === email);
      if (!user) {
        res.status(401);
        return next(new Error('Invalid email or password'));
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401);
        return next(new Error('Invalid email or password'));
      }

      const token = generateToken(user._id, user.email, user.name);

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};