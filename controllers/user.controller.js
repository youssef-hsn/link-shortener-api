import User from '../models/user.model.js';

const DUPLICATE_KEY_ERROR_CODE = 11000;

export const createUser = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, or password is missing' });
    }

    try {
        const record = await User.create({ username, email, password });
        const { password: _, ...userWithoutPassword } = record.toObject();

        return res.status(201).json(userWithoutPassword);
    } catch (error) {
        if (error.code === DUPLICATE_KEY_ERROR_CODE) {
            return res.status(400).json({ error: error });
        }
        return res.status(500).json({ error: 'Server error' });
    }
}

export const getUser = async (req, res) => {
    const { username } = req.params;
    if (!username) return res.status(400).json({ error: 'Username is missing' });

    try {
        const record = await User
            .findOne({ username })
            .select('-password')
            .lean();
        if (!record) return res.status(404).json({ error: 'No user found with the provided username' });
        return res.status(200).json(record);
    }
    catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

export const updateUser = async (req, res) => {
    const { username } = req.params;
    if (!username) return res.status(400).json({ error: 'Username is missing' });

    try {
        const record = await User.findOneAndUpdate
            (
                { username },
                req.body,
                { new: true }
            )
            .select('-password')
            .lean();
        if (!record) return res.status(404).json({ error: 'No user found with the provided username' });
        return res.status(200).json(record);
    }
    catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

export const disableUser = async (req, res) => {
    try {
      const { username } = req.params;
      const user = await User.findOneAndUpdate(username, { isActive: false }, { new: true });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json({ message: 'User disabled successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
}

export const deleteUser = async (req, res) => {
    try {
      const { username } = req.params;
      const user = await User
        .findOneAndDelete({ username });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
      }
    catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
}
