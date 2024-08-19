const express = require("express");
const app = express();
const port = 3000;
// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

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

app.post("/save_deal", function (req, res) {
  if (authenticated) {
    try {
      const result = user_deal_db.insertOne({
        username: currentUser,
        deal_id: req.body.deal_id,
        price: req.body.price,
        retail_price: req.body.retail_price,
        game_name: req.body.game_name,
        deal_link: req.body.deal_link,
        banner_link: req.body.banner_link,
      });
      res.json({ success: true, message: "Deal saved successfully" });
    } catch (err) {
      console.error("Error:", err);
      res.json({ success: false, message: "Server Error" });
    }
  } else {
    res.json({ success: false, message: "Not authenticated" });
  }
});

app.get("/get_saved_deals", async function (req, res) {
  if (authenticated) {
    try {
      const savedDeals = await user_deal_db
        .find({ username: currentUser })
        .toArray();
      res.json({ success: true, saved_deals: savedDeals });
    } catch (err) {
      console.error("Error:", err);
      res.json({ success: false, message: "Server Error" });
    }
  } else {
    res.json({ success: false, message: "Not authenticated" });
  }
});


app.delete("/delete_saved_deal", async function (req, res) {
  console.log("Received DELETE request");

  if (!authenticated) {
    return res.json({ success: false, message: "Not authenticated" });
  }

  const dealId = req.body.deal_id;
  const username = currentUser;

  if (!dealId) {
    return res.json({ success: false, message: "No deal ID provided" });
  }

  try {
    // Use `await` to perform the delete operation
    const result = await user_deal_db.deleteOne({
      username: username,
      deal_id: dealId,
    });

    if (result.deletedCount === 0) {
      console.warn("No deal found with that ID for the current user");
      return res.json({
        success: false,
        message: "No deal found with that ID for the current user",
      });
    } else {
      console.log("Deal deleted successfully");
      return res.json({ success: true, message: "Deal deleted successfully" });
    }
  } catch (err) {
    console.error("Error occurred during deletion:", err);
    return res.json({ success: false, message: "Cannot delete this deal" });
  }
});

app.get("/profile", function (req, res) {
  if (authenticated) {
    res.sendFile(__dirname + "/public/" + "profile");
  } else {
    res.send("<p>not logged in <p><a href='/'>login page</a>");
  }
});

app.get("/logout", function (req, res) {
  authenticated = false;
  currentUser = "";
  res.sendFile(__dirname + "/public/" + "index.html");
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
