import express from 'express';
import { loginUser } from '../controllers/user.js';
import { checkSchema } from 'express-validator';
import { loginUserValidator } from '../middlewares/user.js';

const router = express.Router();

router.post('/login', checkSchema(loginUserValidator), loginUser);

export default router;
