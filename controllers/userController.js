import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// regex for email

export const getUserHome = async function (req, res) {
	try {
		return res.status(200).send();
	} catch (error) {
		res.status(500).send();
	}
}

export const logoutUser = async function (req, res) {
	res.cookie("token", "", {
		httpOnly: true,
		expires: new Date(0)
	})
	.send();
}

export const loginUser = async function (req, res) {
	try {
		const { existingUserId } = req.body;

    	const token = jwt.sign({
    		user: existingUserId
    	}, process.env.JWT_SECRET);


    	res.cookie("token", token, {
    		httpOnly: true
    	}).send();

	} catch (error) {
		res.status(500).send();
	}
}

export const createUser = async function (req, res) {
	try {

		const { username, email, password, passwordVerify } = req.body;
    	const salt = await bcrypt.genSalt();
    	const passwordHash = await bcrypt.hash(password, salt);

		const trimmedUsername = username.trim();
    	const newUser = new User({
    		username, 
    		email,
    		passwordHash
    	});

    	const savedUser = await newUser.save();

    	const token = jwt.sign({
    		user: savedUser._id
    	}, process.env.JWT_SECRET);

    	res.cookie("token", token, {
    		httpOnly: true
    	}).send();

	} catch (error) {
		res.status(500).send();
	}
}