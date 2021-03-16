const jwt = require("jsonwebtoken");

async function checkAuth(req, res, next) {
	try {
		const token = req.cookies.token;

		if (!token) return res.status(401).json({ errorMessage: "Unauthorized."});

		const verified = jwt.verify(token, process.env.JWT_SECRET);

		req.user = verified.user;

		next();

	} catch (error) {
		res.status(401).json({ errorMessage: "Unauthorized."});
	}
}

module.exports = checkAuth;