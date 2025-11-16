import express from 'express';
import Roadmap from '../models/roadmapModel.js';
import LearningItem from '../models/learningItemModel.js';

const router = express.Router();

// @desc    Fetch all roadmaps
// @route   GET /api/content/roadmaps
// @access  Public
router.get('/roadmaps', async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({});
    res.json(roadmaps);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

// @desc    Fetch all learning items
// @route   GET /api/content/learning
// @access  Public
router.get('/learning', async (req, res) => {
  try {
    const learningItems = await LearningItem.find({});
    res.json(learningItems);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

export default router;