import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { createUser } from './user.controller.js';

export const register = async (req, res) => await createUser(req, res);

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account disabled' });
    }

    const payload = { id: user._id, email: user.email, role: user.role };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

export const me = async (req, res) => {
  const { id } = req.user;

  try {
    const record = await User
      .findById(id)
      .select('-password')
      .lean();
    if (!record) return res.status(404).json({ error: 'No user found with the provided id' });
    return res.status(200).json(record);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}

export const updateMe = async (req, res) => {
  const { id } = req.user;

  try {
    const record
      = await User.findByIdAndUpdate
        (
          id,
          req.body,
          { new: true }
        )
        .select('-password')
        .lean();
    if (!record) return res.status(404).json({ error: 'No user found with the provided id' });
    return res.status(200).json(record);
  }
  catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}
