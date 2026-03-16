import Problem from "../models/Problem.js";

/* Get all problems for logged in user */

export const getProblems = async (req, res) => {
  try {

    const problems = await Problem.find({
      userId: req.user._id
    }).sort({ solvedDate: -1 });

    res.json(problems);

  } catch (err) {

    res.status(500).json({ error: err.message });

  }
};


/* Add problem manually */

export const addProblem = async (req, res) => {
  try {

    const problem = await Problem.create({
      ...req.body,
      userId: req.user._id
    });

    res.json(problem);

  } catch (err) {

    res.status(500).json({ error: err.message });

  }
};


/* Delete problem */

export const deleteProblem = async (req, res) => {
  try {

    await Problem.deleteOne({
      _id: req.params.id,
      userId: req.user._id
    });

    res.json({ message: "Problem deleted" });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }
};