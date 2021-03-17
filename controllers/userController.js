import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// regex for email
const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	
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
		const { login, password } = req.body;

// validation
		if (!login || !password)
			return res
				.status(400)
				.json({
					errorMessage: "Must have all required fields."
				});

		let existingUser = await User.findOne ({email: login})
		if (!existingUser) {
			existingUser = await User.findOne ({username: login})
			if (!existingUser)
				return res
					.status(400)
					.json({
						errorMessage: "Wrong login or password."
					});
		}

		const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
		if (!passwordCorrect)
			return res
				.status(400)
				.json({
					errorMessage: "Wrong login or password."
				});

    // log user in

    	const token = jwt.sign({
    		user: existingUser._id
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

// validation

		if (!username || !email || !password || !passwordVerify)
			return res
				.status(400)
				.json({
					errorMessage: "Must have all required fields."
				});


		if (username.length > process.env.MAX_USERNAME_LENGTH)
			return res
				.status(400)
				.json({
					errorMessage: "Username cannot exceed "+process.env.MAX_USERNAME_LENGTH+" characters."
				});

		
    	if (!re.test(String(email).toLowerCase()))
    		return res
    			.status(400)
    			.json({
    				errorMessage: "Must be a valid e-mail."
    			});

    	if (password.length < process.env.MIN_PASSWORD_LENGTH)
    	    return res
    			.status(400)
    			.json({
    				errorMessage: "Password must be at least "+process.env.MIN_PASSWORD_LENGTH+" characters."
    			});

    	if (password.length > 512)
    	    return res
    			.status(400)
    			.json({
    				errorMessage: "Password may not exceed 512 characters."
    			});

    	if (password !== passwordVerify)
    		return res
    			.status(400)
    			.json({
    				errorMessage: "Passwords did not match."
    			});

    	const existingUser = await User.findOne({ username: username })

    	if (existingUser) 
    	    return res
    			.status(400)
    			.json({
    				errorMessage: "Username already exsists."
    			});    	

    	const existingEmail = await User.findOne({ email: email })

    	if (existingEmail) 
    	    return res
    			.status(400)
    			.json({
    				errorMessage: "E-mail already in use."
    			});   

    	const salt = await bcrypt.genSalt();
    	const passwordHash = await bcrypt.hash(password, salt);

    	const newUser = new User({
    		username, 
    		email,
    		passwordHash
    	});

    	const savedUser = await newUser.save();
    
    // log user in

    	const token = jwt.sign({
    		user: savedUser._id
    	}, process.env.JWT_SECRET);

    	res.cookie("token", token, {
    		httpOnly: true
    	}).send();

	} catch (error) {
    // exception handler
		res.status(500).send();
	}
}