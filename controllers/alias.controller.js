import Alias from '../models/alias.model.js';

const DUPLICATE_KEY_ERROR_CODE = 11000;

const canAccessAlias = async (userID, alias) => {
    if (!alias) return true;
    return alias.owner.toString() === userID || alias.sharedWith.includes(userID);
}

export const redirectMe = async (req, res) => {
    const { alias } = req.params;
    if (!alias) return res.status(400).json({ error: 'Alias parameter is missing' });

    try {
        const record = await Alias.findOne({ alias });
        if (!record) return res.status(404).json({ error: 'No link found with the provided alias' });
        record.clicks++;
        record.clickEvents.push({ device: req.headers['user-agent'] });
        record.save();
        return res.redirect(301, record.url);
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

export const getAlias = async (req, res) => {
    const { alias } = req.params;
    if (!alias) return res.status(400).json({ error: 'Alias parameter is missing' });

    try {
        const record = await Alias.findOne({ alias });
        if (!record) return res.status(404).json({ error: 'No link found with the provided alias' });
        return res.status(200).json({
            alias: record.alias,
            url: record.url,
            privilege: await canAccessAlias(req.user.id, record)? 'you are able to manage this alias': 'none',
        });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

export const createAlias = async (req, res) => {
    let { alias, url } = req.body;
    if (!url) return res.status(400).json({ error: 'Alias or URL is missing' });

    if (!alias) alias = Math.random().toString(36).substring(2, 7);

    try {
        const owner = req.user.id;
        const record = await Alias.create({ owner, alias, url });
        return res.status(201).json(record);
    } catch (error) {
        if (error.code === DUPLICATE_KEY_ERROR_CODE) {
            return res.status(400).json({ error: 'Alias already exists' });
        }
        return res.status(500).json({ error: 'Server error' });
    }
}

export const updateAlias = async (req, res) => {
    const { alias } = req.params;
    const { url } = req.body;
    if (!alias || !url) return res.status(400).json({ 
        error: 'Alias or URL is missing',
        hint: 'if you want to delete an alias use the DELETE method' 
    });

    try {
        const record = await Alias.findOne({ alias });

        if (!await canAccessAlias(req.user.id, record)) 
            return res.status(403).json({ error: 'You are not allowed to update this alias' });
        record.url = url;
        record.save();

        if (!record) return res.status(404).json({ error: 'No link found with the provided alias' });
        return res.status(200).json({
            message: 'Link updated',
            alias: record.alias,
            url: record.url,
            clicks: record.clicks,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

export const deleteAlias = async (req, res) => {
    const { alias } = req.params;
    if (!alias) return res.status(400).json({ error: 'Alias is missing' });

    try {
        const record = await Alias.findOne({ alias });
        if (record.owner.toString() !== req.user.id)
            return res.status(403).json({ error: 'You are not allowed to delete this alias' });
        record.deleteOne();
        if (!record) return res.status(404).json({ error: 'No link found with the provided alias' });
        return res.status(200).json({
            message: 'Link deleted',
            alias: record.alias,
            url: record.url,
            clicks: record.clicks,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
