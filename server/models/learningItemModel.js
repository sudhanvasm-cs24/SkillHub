import mongoose from 'mongoose';

// Re-using the same sub-schemas as your roadmapModel
const resourceSchema = mongoose.Schema({
  name: String,
  url: String,
});

const assignmentSchema = mongoose.Schema({
  name: String,
  url: String,
});

const learningStepSchema = mongoose.Schema({
  id: Number, // e.g., 1, 2, 3
  title: String,
  description: String,
  resources: [resourceSchema],
  assignments: [assignmentSchema],
});

// The main schema for the 'learningitems' collection
const learningItemSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  // This is the ID for the URL, e.g., "os", "dbms"
  learningId: {
    type: String,
    required: true,
    unique: true,
  },
  icon: String,
  description: String, 
  steps: [learningStepSchema], 
});

const LearningItem = mongoose.model('LearningItem', learningItemSchema);

export default LearningItem;