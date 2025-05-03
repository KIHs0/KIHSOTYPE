const express = require("express");
const app = express();
//----------setting  up Paths
const path = require("path");

// Move the favicon middleware before express.static
const favicon = require("serve-favicon");
app.use(favicon(path.join(__dirname, "public", "favicons", "favicon.ico")));

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static("public"));

//-----------middleware for parsing res
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//-----------ejs
const engine = require("ejs-mate");
app.engine("ejs", engine);
app.set("view engine", "ejs");
//---------------router Settings
const router = require("./routes/routesFst");
app.use("/", router);

//session
const session = require("express-session");
const sessionObtained = {
  secret: "mysecretCode",
  resave: false,
  saveUninitialized: true,
};
const flash = require("express-flash");
app.use(session(sessionObtained));
app.use(flash());
//-------------------server Listening
const port = 6060;
app.listen(port, (req, res) => {
  console.log(`server at ${port} is on `);
});
app.get("/favicon.ico", (req, res) => {
  console.log("at route faviicon");
  res.sendFile(path.join(__dirname, "public", "favicons", "favicon.ico"));
});
