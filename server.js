const got = require("got");
const express = require("express");
const res = require("express/lib/response");
const { json } = require("express/lib/response");
const bcrypt = require("bcryptjs")// for hashing passwords
const costFactor = 10; // used for the alt
let authenticated = false; // used to see if user is logged in
let currentUser;

// let's make a connection to our mysql server
const mysql = require("mysql2");
const { restart } = require("nodemon");

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "10313110",
    database: "CS2803"
})

conn.connect(function(err){
    if(err){
        console.log("Error:", err);
    }else{
        console.log("Connection established.")
    }
})

const port = process.env.PORT || 80;
// app will be our express instance
const app = express();
app.listen(port, () => console.log(`Server is listening on port ${port}...`));

// Serve static files from the public dir
// if you do not include this, then navigation to the localhost will not show anything
app.use(express.static("public")); // will use the index.html file

// the following is a route
// serve home page
// note that our callback function is anonymous here
app.get("/registration", function(req, res){
    res.sendFile(__dirname + "/public/" + "registration.html");
})


// recall that the login information was passed as a parameter in xhr.send() as a POST request
// the middleware function express.urlencoded must be used for POST requests
// the data will be in the req.body object
app.use(express.urlencoded({extended:false}));

app.post('/register', function(req, res) { // request, response
    // make sure username is available before registration
    usernameQuery = 'Select username from registeredUsers where username = ?'
    conn.query(usernameQuery, [req.body.username], function(err, rows) {
        if (err) res.json({success: false, message: 'Server Error'})
        // if there are rows with the username (should only be 1 max) then it's already taken
        if (rows.length > 0) res.json({success: false, message: 'Sorry, that username is taken.'})
        // username not taken -> insert user into database
        else {
            // encrypt the password before storing it
            passwordHash = bcrypt.hashSync(req.body.password, costFactor)
            insertUser = 'insert into registeredUsers values(?, ?, ?, ?)'
            conn.query(insertUser, [req.body.username, passwordHash, req.body.securityQuestion1, req.body.securityQuestion2], function(err, rows) {
                if (err) res.json({success: false, message: 'Server Error'})
                else res.json({success: true, message: "Registration successful!"})
            })
        }
    })
})

// post to route "attempt login"
app.post("/attempt_login", function(req, res) {
    // we check for the username and password to match.
    conn.query("select password from registeredUsers where username = ?", [req.body.username], function (err, rows) {
        if (err || rows.length == 0) res.json({success: false, message: "That username does not exist."}) 
        else {
            storedPassword = rows[0].password // rows is an array of objects e.g.: [ { password: '12345' } ]
            // bcrypt.compareSync let's compare the plaintext password to the hashed password we stored in our database
            if (bcrypt.compareSync(req.body.password, storedPassword)) {
                authenticated = true;
                currentUser = req.body.username;
                res.json({success: true, message: "Logging you in..."})
            } else res.json({success: false, message:"Incorrect password!"})
        }
    })  
})

app.post("/attempt_recover_pw", function(req, res) {
    conn.query('select password, securityQuestion1, securityQuestion2 from registeredUsers WHERE username = ?', [req.body.username], function (err, rows) {
        if (err || rows.length == 0) res.json({success: false, message: 'That username does not exist.'})
        else {
            storedSQ1 = rows[0].securityQuestion1
            storedSQ2 = rows[0].securityQuestion2
            if (req.body.securityQuestion1 == storedSQ1 && req.body.securityQuestion2 == storedSQ2) {
                passwordHash = bcrypt.hashSync(req.body.password, costFactor)
                updatePassword = 'update registeredUsers set password = ? where username = ?'
                conn.query(updatePassword, [passwordHash, req.body.username], function(err, rows) {
                    if (err) res.json({success: false, message: 'Server Error'})
                    else res.json({success: true, message: 'Password reset successfully!'})
                })
            } else res.json({success: false, message: 'One or more security question answers are wrong.'})
        }
    })
})

// if the user navigates to localhost:3000/main, then the main page will be loaded.
app.get("/main", function(req, res){
    if(authenticated){
        res.sendFile(__dirname + "/public/" + "main.html");
    }else{
        res.send("<p>not logged in <p><a href='/'>login page</a>")
    }
    
})

app.post("/save_deal", function(req, res){
    if (authenticated) {
        const insertDeal = 'insert into saved_deals (username, deal_id, price, retail_price, game_name, deal_link, banner_link) values (?, ?, ?, ?, ?, ?, ?)';
        const dealInfo = [
            currentUser, 
            req.body.deal_id,
            req.body.price,
            req.body.retail_price,
            req.body.game_name,
            req.body.deal_link,
            req.body.banner_link
        ];
        conn.query(insertDeal, dealInfo, function(err, rows) {
            if (err) {
                res.json({success: false, message: 'Server Error'});
            } else {
                res.json({success: true, message: "Registration successful!"});
                
            }
            
        })
    } 
}) 

app.get("/get_saved_deals", function(req, res) {
    conn.query("select * from saved_deals where username = ?", [currentUser], function (err, rows) {
        if (err || rows.length == 0) {
            res.json({success: false, message: "There are no saved deals for this user."}) 
        } else {
            res.json({success: true, message: "deals saved", saved_deals: rows})
        }
    })  
})

app.delete("/delete_saved_deal", function(req, res) {
    conn.query("delete from saved_deals where id = ?", [req.body.id], function (err, results) {
        if (err) {
            res.json({success: false, message: "cannot delete this deal"}) 
        } else {
            res.json({success: true, message: "deals deleted"})
        }
    })  
})

app.post("/shortenURL", function(req, res) {    
    const options = {
        method: 'POST',
        url: 'https://api.short.io/links',
        headers: {
          authorization: 'sk_9FrhKqdnaGWAMaNB',
        },
        json: {
          originalURL:  req.body.url,
          domain: '3z1f.short.gy'
        },
        responseType: 'json'
      };
      
      got(options).then(response => {
        res.json({
            success: true,
            shortURL: response.body['shortURL']

        })
      }); 

}) 

app.get("/profile", function(req, res){
    if(authenticated){
        res.sendFile(__dirname + "/public/" + "profile.html");
    }else{
        res.send("<p>not logged in <p><a href='/'>login page</a>")
    }
    
})
//reference above to navigate upon button click

app.get("/logout", function(req, res){
    authenticated = false;
    currentUser = "";
    res.sendFile(__dirname + "/public/" + "index.html");
})

// Start the web server
// 3000 is the port #
// followed by a callback function
app.listen(3000, function() {
   console.log("Listening on port 3000...");
});
