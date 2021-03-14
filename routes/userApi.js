const router = require("express").Router();

router.post("/", function (req, res) {
	res.send("test");
});

module.exports = router;