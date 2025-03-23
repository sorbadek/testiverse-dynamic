
const express = require('express');
const { 
  getResults, 
  getResult, 
  createResult, 
  getAllResults
} = require('../controllers/result');

const router = express.Router();

// Import auth middleware
const { protect } = require('../middleware/auth');

// Routes
router.route('/')
  .get(protect, getResults)
  .post(protect, createResult);

router.route('/all')
  .get(protect, getAllResults);

router.route('/:id')
  .get(protect, getResult);

module.exports = router;
