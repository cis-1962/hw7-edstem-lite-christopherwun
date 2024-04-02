// /api/questions: GET route for fetching all questions
// /api/questions/add: POST route for adding a question with a body of questionText
// Note that the request body does not and should not contain the author key, think about where you can get it
// /api/questions/answer: POST route for adding/ updating an answer to a question with a body of _id and answer
// Each record in MongoDB has a built-in attribute _id, you should use this as the unique identifier when looking up a question. When you are testing, you can assume that _id is in req.body (i.e. for testing purpose, you can hardcode _id fetched directly from MongoDB in a request).

import express from 'express';
import Question from '../models/question';
import requireAuth from '../middlewares/require-auth';

const qRouter = express.Router();

qRouter.get('/', async (_, res) => {
    const questions = await Question.find();
    res.json(questions);
});

qRouter.post('/add', requireAuth, async (req, res, next) => {
    const { questionText } = req.body;
    const { user } = req.session!;
    const newQuestion = new Question({ questionText, author: user });
    await newQuestion.save();
    if (!newQuestion) {
        next(new Error('Question not created'));
        return;
    }
    res.status(201).json({ message: 'Question created' });

});

qRouter.post('/answer', requireAuth, async (req, res, next) => {
    const { _id, answer } = req.body;
    const question = await Question.findById(_id);
    if (!question) {
        next(new Error('Question not found'));
        return;
    }
    question.answer = answer;
    await question.save();
    res.status(200).json({ message: 'Answer added/updated' });
});

export default qRouter;