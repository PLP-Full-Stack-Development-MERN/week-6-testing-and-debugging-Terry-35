import mongoose from 'mongoose';

const bugSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
    
}, {versionKey: false, timestamps: true});
const Bug = mongoose.model('Bug', bugSchema);
export default Bug;