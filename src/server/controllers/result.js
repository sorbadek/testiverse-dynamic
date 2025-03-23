
const Result = require('../models/Result');
const Test = require('../models/Test');

// @desc    Get all results for a user
// @route   GET /api/results
// @access  Private
exports.getResults = async (req, res, next) => {
  try {
    const results = await Result.find({ user: req.user.id })
      .populate({
        path: 'test',
        select: 'title subject'
      })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: results.length,
      results
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single result
// @route   GET /api/results/:id
// @access  Private
exports.getResult = async (req, res, next) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate({
        path: 'test',
        select: 'title subject questions'
      });
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }
    
    // Make sure the user owns the result
    if (result.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this result'
      });
    }
    
    res.status(200).json({
      success: true,
      result
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new result
// @route   POST /api/results
// @access  Private
exports.createResult = async (req, res, next) => {
  try {
    // Add user id to request body
    req.body.user = req.user.id;
    
    // Check if test exists
    const test = await Test.findById(req.body.test);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    // Calculate score based on answers
    const answers = req.body.answers || [];
    let score = 0;
    let totalPossible = test.questions.length;
    
    answers.forEach(answer => {
      const question = test.questions.find(q => q._id.toString() === answer.question);
      if (question && question.correctAnswer === answer.selectedOption) {
        score += 1;
      }
    });
    
    const scorePercentage = (score / totalPossible) * 100;
    
    // Create the result
    const result = await Result.create({
      ...req.body,
      score,
      totalPossible,
      scorePercentage
    });
    
    res.status(201).json({
      success: true,
      result
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all results (admin only)
// @route   GET /api/results/all
// @access  Private (Admin only)
exports.getAllResults = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access all results'
      });
    }
    
    const results = await Result.find()
      .populate({
        path: 'test',
        select: 'title subject'
      })
      .populate({
        path: 'user',
        select: 'name email'
      })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: results.length,
      results
    });
  } catch (err) {
    next(err);
  }
};
