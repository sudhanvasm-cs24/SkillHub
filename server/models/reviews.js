import mongoose from 'mongoose';

const reviewsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  course: String,
  quote: String,
});

// The third argument 'reviewslist' forces Mongoose to use that exact collection name
const ReviewsList = mongoose.model('ReviewsList', reviewsSchema, 'reviewslist');

export default ReviewsList;