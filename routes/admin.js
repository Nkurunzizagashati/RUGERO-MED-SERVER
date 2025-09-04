import express from 'express';
import { loginAdminController } from '../controllers/admin';

const router = express.Router();

router.post('/login', loginAdminController);
