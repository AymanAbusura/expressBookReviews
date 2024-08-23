const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Session middleware
app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    //Write the authenication mechanism here
    if (!req.session.authorization) {
        return res.status(401).json({ message: "Unauthorized access. No token provided." });
      }
    
      // Extract the token from the session
      const token = req.session.authorization.accessToken;
    
      // Verify the token
      jwt.verify(token, 'secret_key', (err, user) => {
        if (err) {
          return res.status(403).json({ message: "Invalid token" });
        }
    
        // Save the username from the decoded token in the request object
        req.user = user;
        next(); // Proceed to the next middleware or route handler
      });
});
 
const PORT = 3333;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
