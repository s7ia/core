import express from 'express';
import authed from '../middleware/auth';
import { getUserHome, logoutUser, loginUser, createUser } from '../controllers/userController';

const router = express.Router();

router.get("/home", authed, getUserHome);
router.get("/logout", logoutUser);
router.post("/login", loginUser);
router.post("/new", createUser);

module.exports = router;