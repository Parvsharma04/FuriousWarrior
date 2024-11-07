const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const signinRouter = require("./routes/signinRouter");
const signupRouter = require("./routes/signupRouter");
const port = 8000;
require('dotenv').config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    saveUninitialized: false,
    secret: "asdfghjkl;",
    resave: false,
  })
);
app.use(cors());

app.use("/api/v1", signinRouter);
app.use("/api/v1", signupRouter);


const adminAuth = (req,res,next)=>{
  if(req.session.user.role=='admin'){
      next();
  }
  else{
      res.send('Invalid access')
  }
}

const authorAuth = (req,res,next)=>{
  if(req.session.user.role=='author'){
      next();
  }
  else{
      res.send('Invalid access')
  }
}

app.get("/", (req, res) => {
  res.send("Server Online");
});

app.listen(port, () => {
  console.log(`Server Running`);
});
