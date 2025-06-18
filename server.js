if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
console.log(process.env.MONGODB_URL);
}

const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/userSchema");
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
const router2 = require("./routes/routesUSer");

//session
  const cookieParser = require("cookie-parser");
  app.use(cookieParser(process.env.SECRET));
  const session = require("express-session");
  const MongoStore = require("connect-mongo");
  const store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    crypto: {
      secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
  });
  store.on("error", (err) => {
    console.log("ERROR IN MONGODB_SESSION : ON STORE CONFIGURATION");
  });
  store.on('end',()=>{console.log('session store ended CONNECTED TO MONGODB_SESSION')})
  const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
const flash = require("express-flash");
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.currUser = req.user;
  next();
});
app.use(router);
app.use(router2);

//-------------------server Listening
const port = process.env.PORT;
main()
    .then((res) => {
      let ressss = "done database connecting🚀";
      console.log(ressss);
    })
    .catch((e) => console.log("sth got wrong connecting database",e));
async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
// await mongoose.connect("mongodb://127.0.0.1:27017/kihsotype")
}

app.listen(port, (req, res) => {
  console.log(`server at ${port} is on `);
});
