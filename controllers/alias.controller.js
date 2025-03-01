import Alias from '../models/alias.model.js';

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
            clicks: record.clicks,
            clickEvents: "WIP", // TODO /alias/:alias/analytics
        });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

export const createAlias = async (req, res) => {
    const { alias, url } = req.body;
    if (!alias || !url) return res.status(400).json({ error: 'Alias or URL is missing' });

    try {
        const record = await Alias.create({ alias, url });
        return res.status(201).json(record);
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

export const updateAlias = async (req, res) => {
    const { alias, url } = req.body;
    if (!alias || !url) return res.status(400).json({ 
        error: 'Alias or URL is missing',
        hint: 'if you want to delete an alias use the DELETE method' 
    });

    try {
        const record = await Alias.findOneAndUpdate({ alias }, { url }, { new: true });
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
        const record = await Alias.findOneAndDelete({ alias });
        if (!record) return res.status(404).json({ error: 'No link found with the provided alias' });
        return res.status(200).json({
            message: 'Link deleted',
            alias: record.alias,
            url: record.url,
            clicks: record.clicks,
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}
