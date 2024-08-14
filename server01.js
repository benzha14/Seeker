const express = require("express");
const app = express();
const port = 3000;

const bcrypt = require("bcryptjs");
const costFactor = 10;

let authenticated = false; // used to see if user is logged in
let currentUser;

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://bensonzhang345:apple1234@seekercluster0.illcb.mongodb.net/?retryWrites=true&w=majority&appName=SeekerCluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db, userdb, user_deal_db;

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db("seekerDB");
    userdb = db.collection("users");
    user_deal_db = db.collection("user_deals");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

// Connect to MongoDB when the application starts
connectToMongoDB();

app.use(express.static("public"));
// Define a route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
  try {
    const { username, password, securityQuestion1, securityQuestion2 } =
      req.body;

    // Define the query
    const query = { username: username };

    // Use await to retrieve the document
    const document = await userdb.findOne(query);

    // Respond to the client
    if (document) {
      res.json({ success: false, message: "Username already exists" });
    } else {
      passwordHash = bcrypt.hashSync(password, costFactor);
      const result = userdb.insertOne({
        username: username,
        password: passwordHash,
        securityQ1: securityQuestion1,
        securityQ2: securityQuestion2,
      });
    }
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, message: "Server Error" });
  }
});

// post to route "attempt login"
app.post("/attempt_login", async function (req, res) {
  const { username, password } = req.body;

  try {
    const query = { username: username };

    const document = await userdb.findOne(query);

    if (document) {
      if (bcrypt.compareSync(password, document.password)) {
        console.log("password and username matched");
        res.json({ success: true, message: "logging in ..." });
        authenticated = true;
        currentUser = username;
      } else {
        console.log("wrong password");
      }
    } else {
      res.json({ sucess: false, message: "username not found" });
    }
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, message: "Server Error" });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
