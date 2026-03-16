const Problem = require("../models/Problem");

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const problems = await Problem.find({ userId });

    const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekly = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Initialize logic for the past 7 days up to today
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        weekly.push({
            day: daysMap[d.getDay()],
            solved: 0,
            dateKey: d.toISOString().split('T')[0]
        });
    }

    let easyCount = 0;
    let medCount = 0;
    let hardCount = 0;
    
    let platformCounts = {};
    let topicCounts = {};
    
    problems.forEach(p => {
        // compute weekly progress
        if (p.solvedDate) {
            const solvedKey = new Date(p.solvedDate).toISOString().split('T')[0];
            const weekDay = weekly.find(w => w.dateKey === solvedKey);
            if (weekDay) weekDay.solved++;
        }

        // compute difficulty
        if (p.difficulty) {
            const d = p.difficulty.toLowerCase();
            if (d === 'easy' || (!isNaN(d) && parseInt(d) <= 1200)) easyCount++;
            else if (d === 'medium' || (!isNaN(d) && parseInt(d) > 1200 && parseInt(d) <= 1800)) medCount++;
            else hardCount++;
        }

        // compute platform
        if (p.platform) {
            platformCounts[p.platform] = (platformCounts[p.platform] || 0) + 1;
        }

        // compute topics
        if (p.topic) {
            topicCounts[p.topic] = (topicCounts[p.topic] || 0) + 1;
        }
    });

    const difficulty = [
        { name: "Easy", value: easyCount },
        { name: "Medium", value: medCount },
        { name: "Hard", value: hardCount }
    ];

    const platform = Object.keys(platformCounts).map(k => ({ platform: k, solved: platformCounts[k] }));
    const topics = Object.keys(topicCounts).map(k => ({ topic: k, count: topicCounts[k] }));

    res.json({
        weekly,
        difficulty,
        platform,
        topics
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
