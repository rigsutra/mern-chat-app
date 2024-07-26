const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Message = require("./models/Message");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const ws = require("ws");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN_URL,
  })
);

const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

// Improved mongoose connection with options
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit process with failure
  });

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.get("/profile", async (req, res) => {
  const token = req.cookies?.token;
  console.log("Token received:", token); // Log the token

  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res.status(403).json("Invalid token");
      }
      res.json(userData);
    });
  } else {
    console.warn("No token provided");
    res.status(401).json("No token provided");
    console.log("No token received");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (passOk) {
      jwt.sign(
        { userId: foundUser._id, username },
        jwtSecret,
        {},
        (err, token) => {
          if (err) {
            console.error("JWT signing error:", err);
            return res.status(500).json("Internal server error");
          }
          res.cookie("token", token, { sameSite: "none", secure: true }).json({
            id: foundUser._id,
          });
        }
      );
    } else {
      res.status(401).json("Incorrect password");
      console.log("Incorrect password");
    }
  } else {
    res.status(404).json("User not found");
    console.log("user not found");
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({
      username: username,
      password: hashedPassword,
    });
    jwt.sign(
      { userId: createdUser._id, username },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({
            _id: createdUser._id,
          });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json("error");
  }
});

const server = app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});

const wss = new ws.WebSocketServer({ server });
wss.on("connection", (connection, req) => {
  // read username and the Id from the cookies for this connection

  console.log("Client wss connected");

  const cookies = req.headers.cookie;
  if (cookies) {
    // this is to clear the cookies from the its name as it is written in the token = "" form but we only want the cookies value noting else.
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) {
            console.error("JWT verification error:", err);
            return;
          }
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text } = messageData;
    console.log(messageData);
    if (recipient && text) {
      // this will return promise so we need to add await
      const messageDoc = await Message.create({
        sender: connection.userId,
        recipient: recipient,
        text: text,
      });

      [...wss.clients]
        .filter((c) => c.userId === recipient)
        .forEach((c) => {
          c.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              id: messageDoc._id,
              recipient,
            })
          );
        });
    }
  });
  // Send online users to all clients and notify them if someone connects
  [...wss.clients].forEach((client) => {
    client.send(
      JSON.stringify({
        online: [...wss.clients].map((c) => ({
          userId: c.userId,
          username: c.username,
        })),
      })
    );
  });
});
