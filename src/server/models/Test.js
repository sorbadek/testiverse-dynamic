
const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Option text is required']
  },
  value: {
    type: String,
    required: [true, 'Option value is required']
  }
});

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: [OptionSchema],
  correctAnswer: {
    type: String,
    required: [true, 'Correct answer is required']
  },
  explanation: {
    type: String,
    default: ''
  }
});

const TestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    subject: {
      type: String,
      required: [true, 'Please add a subject'],
      trim: true
    },
    timeLimit: {
      type: Number,
      required: [true, 'Please add a time limit in minutes'],
      min: [1, 'Time limit must be at least 1 minute']
    },
    questions: [QuestionSchema],
    isPublished: {
      type: Boolean,
      default: true
    },
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Cascade delete results when a test is deleted
TestSchema.pre('remove', async function(next) {
  await this.model('Result').deleteMany({ test: this._id });
  next();
});

// Reverse populate with virtuals
TestSchema.virtual('results', {
  ref: 'Result',
  localField: '_id',
  foreignField: 'test',
  justOne: false
});

module.exports = mongoose.model('Test', TestSchema);
