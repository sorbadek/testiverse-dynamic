
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please provide question text'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer', 'essay'],
    required: true,
  },
  options: [{
    text: {
      type: String,
      trim: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  }],
  correctAnswer: {
    type: String,
    trim: true,
  },
  points: {
    type: Number,
    required: true,
    default: 1,
  },
  explanation: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const TestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a test title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
    trim: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timeLimit: {
    type: Number, // Time in minutes
  },
  passingScore: {
    type: Number, // Percentage
    min: 0,
    max: 100,
  },
  questions: [QuestionSchema],
  isPublished: {
    type: Boolean,
    default: false,
  },
  allowReview: {
    type: Boolean,
    default: true,
  },
  randomizeQuestions: {
    type: Boolean,
    default: false,
  },
  showResults: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total points
TestSchema.virtual('totalPoints').get(function() {
  return this.questions.reduce((total, question) => total + question.points, 0);
});

module.exports = mongoose.model('Test', TestSchema);
