
const Test = require('../models/Test');
const User = require('../models/User');

// @desc    Get all tests
// @route   GET /api/tests
// @access  Public
exports.getTests = async (req, res, next) => {
  try {
    const tests = await Test.find()
      .populate('creator', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: tests.length,
      tests
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single test
// @route   GET /api/tests/:id
// @access  Public
exports.getTest = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id).populate('creator', 'name');
    
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    res.status(200).json({
      success: true,
      test
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new test
// @route   POST /api/tests
// @access  Private (Teacher, Admin)
exports.createTest = async (req, res, next) => {
  try {
    // Add creator to req.body
    req.body.creator = req.user.id;
    
    // Check if user is authorized to create tests
    const user = await User.findById(req.user.id);
    if (user.role !== 'teacher' && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only teachers and admins can create tests'
      });
    }
    
    const test = await Test.create(req.body);
    
    res.status(201).json({
      success: true,
      test
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update test
// @route   PUT /api/tests/:id
// @access  Private (Owner, Admin)
exports.updateTest = async (req, res, next) => {
  try {
    let test = await Test.findById(req.params.id);
    
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    // Make sure user is test owner or admin
    const user = await User.findById(req.user.id);
    if (test.creator.toString() !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this test'
      });
    }
    
    test = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      test
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete test
// @route   DELETE /api/tests/:id
// @access  Private (Owner, Admin)
exports.deleteTest = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id);
    
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    // Make sure user is test owner or admin
    const user = await User.findById(req.user.id);
    if (test.creator.toString() !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this test'
      });
    }
    
    await test.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
