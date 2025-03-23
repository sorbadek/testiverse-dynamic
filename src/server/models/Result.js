
const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  selectedOptions: [{
    type: String,
  }],
  answerText: {
    type: String,
    trim: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
  feedback: {
    type: String,
    trim: true,
  }
});

const ResultSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [AnswerSchema],
  score: {
    type: Number,
    default: 0,
  },
  totalPossible: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    default: 0,
  },
  passed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
  timeSpent: {
    type: Number, // Time in seconds
    default: 0,
  },
  status: {
    type: String,
    enum: ['started', 'in-progress', 'completed', 'graded'],
    default: 'started',
  }
}, {
  timestamps: true,
});

// Calculate percentage and passed status before saving
ResultSchema.pre('save', function(next) {
  if (this.totalPossible > 0) {
    this.percentage = (this.score / this.totalPossible) * 100;
  }
  
  // If the test has a passing score defined, check if user passed
  if (this.isModified('score') && this.test.passingScore) {
    this.passed = this.percentage >= this.test.passingScore;
  }
  
  next();
});

module.exports = mongoose.model('Result', ResultSchema);
