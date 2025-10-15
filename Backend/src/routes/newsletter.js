import express from 'express';
import { body, validationResult } from 'express-validator';
import Subscriber from '../models/Subscriber.js';

const router = express.Router();

// POST /api/newsletter/subscribe
router.post('/subscribe', 
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg
        });
      }

      const { email } = req.body;

      // Check if email already exists
      const existingSubscriber = await Subscriber.findOne({ email });
      if (existingSubscriber) {
        return res.status(409).json({
          success: false,
          message: 'This email is already subscribed to our newsletter'
        });
      }

      // Create new subscriber
      const newSubscriber = new Subscriber({
        email,
        subscribedAt: new Date()
      });

      await newSubscriber.save();

      res.status(201).json({
        success: true,
        message: 'Successfully subscribed to newsletter'
      });

    } catch (error) {
      console.error('Newsletter subscription error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error. Please try again later.'
      });
    }
  }
);

// GET /api/newsletter/subscribers (Admin route - optional)
router.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await Subscriber.find()
      .sort({ subscribedAt: -1 })
      .select('email subscribedAt');
    
    res.json({
      success: true,
      data: subscribers
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscribers'
    });
  }
});

export default router;
