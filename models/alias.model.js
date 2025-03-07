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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
    clickEvents: [clickEventSchema],
    sharedWith: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
}, {
    timestamps: true,
});

const Alias = mongoose.model('Alias', aliasSchema);

export default Alias;