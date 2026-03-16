import cron from "node-cron";
import User from "../models/User.js";
import Problem from "../models/Problem.js";
import { fetchLeetCodeSolved } from "../services/leetcodeService.js";
import { fetchCodeforcesSolved } from "../services/codeforcesService.js";

/* LeetCode sync every 30 minutes */

cron.schedule("*/30 * * * *", async () => {

  console.log("Running LeetCode sync...");

  const users = await User.find({
    "platforms.leetcode": { $ne: null }
  });

  for (const user of users) {

    try {

      const problems = await fetchLeetCodeSolved(
        user.platforms.leetcode
      );

      for (const p of problems) {

        await Problem.updateOne(
          {
            userId: user._id,
            title: p.title,
            platform: "leetcode"
          },
          {
            $set: p
          },
          {
            upsert: true
          }
        );

      }

      user.lastSync.leetcode = new Date();
      await user.save();

    } catch (err) {

      console.error("LeetCode sync error:", err.message);

    }

  }

});


/* Codeforces sync every hour */

cron.schedule("0 * * * *", async () => {

  console.log("Running Codeforces sync...");

  const users = await User.find({
    "platforms.codeforces": { $ne: null }
  });

  for (const user of users) {

    try {

      const problems = await fetchCodeforcesSolved(
        user.platforms.codeforces
      );

      for (const p of problems) {

        await Problem.updateOne(
          {
            userId: user._id,
            title: p.title,
            platform: "codeforces"
          },
          {
            $set: p
          },
          {
            upsert: true
          }
        );

      }

      user.lastSync.codeforces = new Date();
      await user.save();

    } catch (err) {

      console.error("Codeforces sync error:", err.message);

    }

  }

});