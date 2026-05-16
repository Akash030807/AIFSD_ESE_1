const Candidate = require('../models/Candidate');

// POST /api/candidates — Add a candidate
const addCandidate = async (req, res, next) => {
  try {
    const { name, email, skills, experience, bio } = req.body;

    // Normalize skills to array of trimmed strings
    const normalizedSkills = Array.isArray(skills)
      ? skills.map((s) => s.trim())
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim())
      : [];

    const candidate = new Candidate({
      name,
      email,
      skills: normalizedSkills,
      experience,
      bio: bio || '',
    });

    await candidate.save();

    res.status(201).json({
      success: true,
      message: 'Candidate added successfully',
      data: candidate,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A candidate with this email already exists',
      });
    }
    next(err);
  }
};

// GET /api/candidates — Get all candidates
const getCandidates = async (req, res, next) => {
  try {
    const { search, skill } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }

    if (skill) {
      query.skills = { $in: [new RegExp(skill, 'i')] };
    }

    const candidates = await Candidate.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/candidates/:id — Delete a candidate
const deleteCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }
    res.status(200).json({ success: true, message: 'Candidate deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { addCandidate, getCandidates, deleteCandidate };
