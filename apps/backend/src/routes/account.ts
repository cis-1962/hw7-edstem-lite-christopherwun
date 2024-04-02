// In account.ts, you should create the following 3 routes:

// /api/account/signup: POST route for signup with a body of username and password
// /api/account/login: POST route for login with a body of username and password
// /api/account/logout: POST route for logout

import express from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import requireAuth from '../middlewares/require-auth';

const accRouter = express.Router();

accRouter.post('/signup', async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    // use next to throw an error:
    if (user) {
        next(new Error('User already exists'));
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created' });
    });

accRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (!user) {
        next(new Error('User not found'));
        return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        next(new Error('Invalid password'));
        return;
    }
    req.session!.user = user.username;

    res.status(200).json({ message: 'Login successful' });
    });

accRouter.post('/logout', requireAuth, (req, res) => {
    req.session = null;
    res.status(200).json({ message: 'Logout successful' });
    });
    
export default accRouter;
