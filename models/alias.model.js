import mongoose from 'mongoose';

const clickEventSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
    },
    device: {
        type: String,
        required: true,
    },
}, { _id: false });

const aliasSchema = new mongoose.Schema({
    alias: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    url: {
        type: String,
        required: true,
    },
    clicks: {
        type: Number,
        default: 0,
    },
    clickEvents: [clickEventSchema]
}, {
    timestamps: true,
});

const Alias = mongoose.model('Alias', aliasSchema);

export default Alias;