const express = require('express');
const router = express.Router();
const {
  addCandidate,
  getCandidates,
  deleteCandidate,
} = require('../controllers/candidateController');

// POST /api/candidates
router.post('/', addCandidate);

// GET /api/candidates
router.get('/', getCandidates);

// DELETE /api/candidates/:id
router.delete('/:id', deleteCandidate);

module.exports = router;
