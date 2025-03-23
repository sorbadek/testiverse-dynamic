
const express = require('express');
const { 
  getTests, 
  getTest, 
  createTest, 
  updateTest, 
  deleteTest 
} = require('../controllers/test');

const router = express.Router();

// Import auth middleware
const { protect } = require('../middleware/auth');

// Routes
router.route('/')
  .get(getTests)
  .post(protect, createTest);

router.route('/:id')
  .get(getTest)
  .put(protect, updateTest)
  .delete(protect, deleteTest);

module.exports = router;
