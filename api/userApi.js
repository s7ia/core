const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/logout", async function (req, res) {
	res.cookie("token", "", {
		httpOnly: true,
		expires: new Date(0)
	})
	.send();
})

router.post("/login", async function (req, res) {
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
})

router.post("/new", async function (req, res) {
	try {

		const { username, email, password, passwordVerify } = req.body;

// validation

		if (!username || !email || !password || !passwordVerify)
			return res
				.status(400)
				.json({
					errorMessage: "Must have all required fields."
				});


		if (username.length > 16)
			return res
				.status(400)
				.json({
					errorMessage: "Username cannot exceed 16 characters."
				});

		const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	
    	if (!re.test(String(email).toLowerCase()))
    		return res
    			.status(400)
    			.json({
    				errorMessage: "Must be a valid e-mail."
    			});

    	if (password.length < 6)
    	    return res
    			.status(400)
    			.json({
    				errorMessage: "Password must be at least 6 characters."
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
});

module.exports = router;