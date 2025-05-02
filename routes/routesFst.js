const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("./mainEjs/homePage.ejs");
});

module.exports = router;
router.get("/terms", (req, res) => {
  res.render("./mainEjs/terms.ejs");
});
router.get("/privacy", (req, res) => {
  res.render("./mainEjs/privacy.ejs");
});

router.get("/willreach", (req, res) => {
  res.render("./mainEjs/willreachhere.ejs");
});
