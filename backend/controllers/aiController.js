const axios = require('axios');
const Candidate = require('../models/Candidate');

// POST /api/ai/shortlist — AI-based ranking using OpenRouter
const aiShortlist = async (req, res, next) => {
  try {
    const { requiredSkills, minExperience, preferredSkills, jobTitle, jobDescription } = req.body;

    if (!requiredSkills || !Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'requiredSkills must be a non-empty array',
      });
    }

    // Fetch all candidates
    const candidates = await Candidate.find({});

    if (candidates.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No candidates in database',
        data: [],
        aiAnalysis: null,
      });
    }

    // Build the candidate list string for the prompt
    const candidateList = candidates
      .map(
        (c, i) =>
          `${i + 1}. ${c.name} | Skills: ${c.skills.join(', ')} | Experience: ${c.experience} year(s) | Bio: ${c.bio || 'N/A'}`
      )
      .join('\n');

    const prompt = `You are an expert technical recruiter AI. Analyze the following candidates and rank them for the job.

JOB REQUIREMENTS:
- Title: ${jobTitle || 'Software Developer'}
- Required Skills: ${requiredSkills.join(', ')}
- Minimum Experience: ${minExperience || 0} year(s)
- Preferred Skills: ${(preferredSkills || []).join(', ') || 'None'}
${jobDescription ? `- Job Description: ${jobDescription}` : ''}

CANDIDATES:
${candidateList}

Please respond with a JSON object in EXACTLY this format (no markdown, no extra text, just pure JSON):
{
  "rankedCandidates": [
    {
      "rank": 1,
      "name": "Candidate Name",
      "score": 95,
      "tier": "High",
      "reason": "Detailed explanation of why this candidate is a good fit",
      "strengths": ["strength1", "strength2"],
      "gaps": ["gap1", "gap2"],
      "interviewQuestions": ["Question 1?", "Question 2?", "Question 3?"]
    }
  ],
  "summary": "Overall analysis summary",
  "topPick": "Name of best candidate",
  "topPickReason": "Why this is the best candidate"
}`;

    // Call OpenRouter API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.3-8b-instruct:free',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert technical recruiter. Always respond with valid JSON only, no markdown formatting.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://aifsd-ese-1.onrender.com',
          'X-Title': 'Candidate Shortlisting System',
        },
      }
    );

    const rawContent = response.data.choices[0].message.content.trim();

    // Parse JSON from AI response
    let aiResult;
    try {
      // Strip markdown code fences if present
      const jsonStr = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      aiResult = JSON.parse(jsonStr);
    } catch (parseErr) {
      // If parsing fails, return raw content
      return res.status(200).json({
        success: true,
        rawAiResponse: rawContent,
        message: 'AI responded but output could not be parsed as JSON',
        data: [],
      });
    }

    // Merge AI rankings with candidate DB data
    const enriched = (aiResult.rankedCandidates || []).map((aiC) => {
      const dbCandidate = candidates.find(
        (c) => c.name.toLowerCase() === aiC.name.toLowerCase()
      );
      return {
        ...aiC,
        candidateData: dbCandidate || null,
      };
    });

    res.status(200).json({
      success: true,
      jobRequirements: { requiredSkills, minExperience, preferredSkills, jobTitle },
      summary: aiResult.summary,
      topPick: aiResult.topPick,
      topPickReason: aiResult.topPickReason,
      data: enriched,
    });
  } catch (err) {
    if (err.response) {
      console.error('OpenRouter API Error:', err.response.data);
      return res.status(502).json({
        success: false,
        message: 'OpenRouter API error',
        details: err.response.data,
      });
    }
    next(err);
  }
};

module.exports = { aiShortlist };
