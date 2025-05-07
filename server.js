const express = require("express");
const app = express();
const https = require("https");
const agent = new https.Agent({ rejectUnauthorized: false });

const axios = require("axios");
const cors = require("cors");
app.use(cors());

//----------setting  up Paths
const path = require("path");
const favicon = require("serve-favicon");
app.use(favicon(path.join(__dirname, "public", "favicons2", "favicon.ico")));

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

//-----------middleware for parsing res
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//-----------ejs
const engine = require("ejs-mate");
app.engine("ejs", engine);
app.set("view engine", "ejs");
//---------------router Settings
const router = require("./routes/routesFst");
app.use(router);

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
app.get("/api/random-quote", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.quotable.io/quotes/random?minLength=200&maxLength=300",
      { httpsAgent: agent }
    );

    const quote = response.data[0]; // Get the first quote from the response
    // Send quote data to frontend
    res.json(quote);
  } catch (error) {
    console.error("Error fetching the quote:", error);
    res.status(500).send("Failed to fetch quote");
  }
});
//-------------------server Listening
const port = 6060;
app.listen(port, (req, res) => {
  console.log(`server at ${port} is on `);
});
app.get("/favicon.ico", (req, res) => {
  console.log("at route faviicon");
  res.sendFile(path.join(__dirname, "public", "favicons2", "favicon.ico"));
});
