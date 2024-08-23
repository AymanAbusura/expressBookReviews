const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const user = users.find(user => user.username === username && user.password === password);
  return user ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  // Retrieve the username and password from the request body
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Validate the user credentials
  if (authenticatedUser(username, password)) {
    // Generate a JWT token
    let accessToken = jwt.sign(
      { username: username }, 
      'secret_key',  // Use a secret key for JWT
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Save the token in the session
    req.session.authorization = { accessToken };

    return res.status(200).json({ message: "Login successful", token: accessToken });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // Retrieve the review from the request body and the ISBN from the request parameters
  const { review } = req.body;
  const isbn = req.params.isbn;

  // Ensure the user is authenticated (username is retrieved from the token in middleware)
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized access. No token provided." });
  }

  const username = req.user.username; // Username from the token

  // Check if the book with the given ISBN exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }

  // Add or modify the review for this user
  if (!book.reviews) {
    book.reviews = {}; // Initialize reviews object if it doesn't exist
  }

  // Add or modify the user's review
  book.reviews[username] = review;

  return res.status(200).json({
    message: `Review for book with ISBN ${isbn} has been successfully added/modified`,
    reviews: book.reviews
  });
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[isbn]) {
      let book = books[isbn];
      delete book.reviews[username];
      return res.status(200).send("Review successfully deleted");
  }
  else {
      return res.status(404).json({message: `ISBN ${isbn} not found`});
  }
});
// regd_users.delete("/auth/review/:isbn", (req, res) => {
//   // Retrieve the ISBN from the request parameters
//   const isbn = req.params.isbn;

//   // Ensure the user is authenticated (username is retrieved from the token in middleware)
//   if (!req.user) {
//     return res.status(401).json({ message: "Unauthorized access. No token provided." });
//   }

//   const username = req.user.username; // Username from the token

//   // Check if the book with the given ISBN exists
//   const book = books[isbn];
//   if (!book) {
//     return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
//   }

//   // Check if the user has already submitted a review for this book
//   if (!book.reviews || !book.reviews[username]) {
//     return res.status(404).json({ message: `No review found for user ${username} on book with ISBN ${isbn}` });
//   }

//   // Delete the user's review
//   delete book.reviews[username];

//   return res.status(200).json({
//     message: `Review by user ${username} for book with ISBN ${isbn} has been successfully deleted`,
//     reviews: book.reviews
//   });
// });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
