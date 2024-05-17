import express from 'express';
import miscRouter from './misc-router.js';
import user from './user-router.js';
import auth from './auth-router.js';


const router = express.Router();


router.use(miscRouter);

router.use(user);

router.use(auth);

export default router;
