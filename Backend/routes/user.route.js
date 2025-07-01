const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the EndPix AI-IE API",
  });
});

module.exports = router;
