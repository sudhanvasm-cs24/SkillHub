import mongoose from 'mongoose';

const resourceSchema = mongoose.Schema({
  name: String,
  url: String,
});

const assignmentSchema = mongoose.Schema({
  name: String,
  url: String,
});

const stepSchema = mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  resources: [resourceSchema],
  assignments: [assignmentSchema],
});

const roadmapSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  roadmapId: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  icon: String,
  steps: [stepSchema],
});

const Roadmap = mongoose.model('Roadmap', roadmapSchema);

export default Roadmap;