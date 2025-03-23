
const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  selectedOption: {
    type: String,
    required: true
  }
});

const ResultSchema = new mongoose.Schema(
  {
    test: {
      type: mongoose.Schema.ObjectId,
      ref: 'Test',
      required: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    totalPossible: {
      type: Number,
      required: true
    },
    scorePercentage: {
      type: Number,
      required: true
    },
    timeTaken: {
      type: Number, // in seconds
      required: true
    },
    answers: [AnswerSchema],
    completed: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent user from submitting more than one result per test
ResultSchema.index({ test: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Result', ResultSchema);
