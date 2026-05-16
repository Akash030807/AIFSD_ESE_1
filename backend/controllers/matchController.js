const Candidate = require('../models/Candidate');

// POST /api/match — Basic skill + experience matching
const matchCandidates = async (req, res, next) => {
  try {
    const { requiredSkills, minExperience, preferredSkills } = req.body;

    if (!requiredSkills || !Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'requiredSkills must be a non-empty array',
      });
    }

    const normalizedRequired = requiredSkills.map((s) => s.toLowerCase().trim());
    const normalizedPreferred = (preferredSkills || []).map((s) => s.toLowerCase().trim());
    const minExp = minExperience || 0;

    // Fetch all candidates from DB
    const allCandidates = await Candidate.find({});

    const ranked = allCandidates
      .map((candidate) => {
        const candidateSkills = candidate.skills.map((s) => s.toLowerCase().trim());

        // Required skill matches
        const matchedRequired = normalizedRequired.filter((skill) =>
          candidateSkills.includes(skill)
        );

        // Preferred skill matches (bonus)
        const matchedPreferred = normalizedPreferred.filter((skill) =>
          candidateSkills.includes(skill)
        );

        const requiredScore =
          normalizedRequired.length > 0
            ? matchedRequired.length / normalizedRequired.length
            : 0;

        const preferredBonus =
          normalizedPreferred.length > 0
            ? (matchedPreferred.length / normalizedPreferred.length) * 0.2
            : 0;

        const totalScore = Math.min(requiredScore + preferredBonus, 1);

        // Experience check
        const meetsExperience = candidate.experience >= minExp;

        // Tier classification
        let tier;
        if (requiredScore >= 0.8 && meetsExperience) tier = 'High';
        else if (requiredScore >= 0.5 || meetsExperience) tier = 'Medium';
        else tier = 'Low';

        return {
          _id: candidate._id,
          name: candidate.name,
          email: candidate.email,
          skills: candidate.skills,
          experience: candidate.experience,
          bio: candidate.bio,
          matchedRequired,
          matchedPreferred,
          matchScore: Math.round(totalScore * 100),
          requiredScore: Math.round(requiredScore * 100),
          meetsExperience,
          tier,
        };
      })
      .sort((a, b) => {
        // Sort: High > Medium > Low, then by matchScore desc
        const tierOrder = { High: 3, Medium: 2, Low: 1 };
        if (tierOrder[b.tier] !== tierOrder[a.tier]) {
          return tierOrder[b.tier] - tierOrder[a.tier];
        }
        return b.matchScore - a.matchScore;
      });

    res.status(200).json({
      success: true,
      totalCandidates: ranked.length,
      jobRequirements: { requiredSkills, minExperience: minExp, preferredSkills },
      data: ranked,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { matchCandidates };
