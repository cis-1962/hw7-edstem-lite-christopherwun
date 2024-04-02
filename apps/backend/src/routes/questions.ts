// /api/questions: GET route for fetching all questions
// /api/questions/add: POST route for adding a question with a body of questionText
// Note that the request body does not and should not contain the author key, think about where you can get it
// /api/questions/answer: POST route for adding/ updating an answer to a question with a body of _id and answer
// Each record in MongoDB has a built-in attribute _id, you should use this as the unique identifier when looking up a question. When you are testing, you can assume that _id is in req.body (i.e. for testing purpose, you can hardcode _id fetched directly from MongoDB in a request).

import express from 'express';
import Question from '../models/question';
import requireAuth from '../middlewares/require-auth';

const qRouter = express.Router();

qRouter.get('/', async (_, res, next) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
    next();
  } catch (err) {
    res.status(500).json({ message: 'Error fetching questions' });
    // console.error(err);
    next(err);
  }
});

qRouter.post('/add', requireAuth, async (req, res, next) => {
  try {
    const user = req.session!.user;
    const question = new Question({
      questionText: req.body.questionText,
      answer: '',
      author: user,
    });
    await question.save();
    res.status(201).json({ message: 'Question created' });
    next();
  } catch (err) {
    res.status(400).json({ message: 'Question not created' });
    next(err);
  }
});

qRouter.post('/answer', requireAuth, async (req, res, next) => {
  try {
    const question = await Question.findById(req.body._id).exec();
    if (!question) {
      res.status(404).json({ message: 'Question not found' });
      next();
      return;
    }
    question.answer = req.body.answer;
    await question.save();
    res.status(200).json({ message: 'Answer added' });
    next();
  } catch (err) {
    res.status(400).json({ message: 'Answer not added' });
    // console.error(err);
    next(err);
  }
});

export default qRouter;
