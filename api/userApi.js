import express from 'express';
import authed from '../middleware/auth';
import { getUserHome, logoutUser, loginUser, createUser } from '../controllers/userController';
import { validateUserRegistrationInput, validateUserLoginInput } from '../utils/validators';


const router = express.Router();

router.get("/home", authed, getUserHome);
router.get("/logout", logoutUser);
router.post("/login", validateUserLoginInput, loginUser);
router.post("/new", validateUserRegistrationInput, createUser);

module.exports = router;