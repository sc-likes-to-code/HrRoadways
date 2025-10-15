import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Index for better query performance
subscriberSchema.index({ email: 1 });
subscriberSchema.index({ subscribedAt: -1 });

export default mongoose.model('Subscriber', subscriberSchema);