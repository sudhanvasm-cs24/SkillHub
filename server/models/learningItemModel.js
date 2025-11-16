import mongoose from 'mongoose';

const learningItemSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  icon: String,
  videoUrl: String,
});

const LearningItem = mongoose.model('LearningItem', learningItemSchema);

export default LearningItem;