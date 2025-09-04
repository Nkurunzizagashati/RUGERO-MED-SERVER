import express from 'express';
import userRouter from './user.js';
import productRouter from './product.js';
import newsRouter from './news.js';

const router = express.Router();

router.use('/user', userRouter);
router.use('/products', productRouter);
router.use('/news', newsRouter);

export default router;
