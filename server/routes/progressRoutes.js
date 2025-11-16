import express from 'express';
import User from '../models/userModel.js';
import protect from '../middleware/authMiddleware.js'; // Our auth middleware

const router = express.Router();

// @desc    Get user progress
// @route   GET /api/progress
// @access  Private (requires token)
router.get('/', protect, async (req, res) => {
  // req.user is attached by the 'protect' middleware
  if (req.user) {
    res.json({ completedSteps: req.user.completedSteps });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Toggle a step's completion status
// @route   POST /api/progress/toggle
// @access  Private
router.post('/toggle', protect, async (req, res) => {
  const { stepId } = req.body;

  if (!stepId) {
    return res.status(400).json({ message: 'stepId is required' });
  }

  try {
    const user = req.user;
    const completedSteps = [...user.completedSteps];

    const stepIndex = completedSteps.indexOf(stepId);

    if (stepIndex > -1) {
      // Step is already complete, so remove it
      completedSteps.splice(stepIndex, 1);
    } else {
      // Step is not complete, so add it
      completedSteps.push(stepId);
    }

    // Update the user in the database
    user.completedSteps = completedSteps;
    const updatedUser = await user.save();

    res.json({ completedSteps: updatedUser.completedSteps });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

export default router;