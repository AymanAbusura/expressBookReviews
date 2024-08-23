const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');

// Function to simulate fetching books data (like an API call) TASK-10
function fetchBooks() {
  return new Promise((resolve, reject) => {
    // Simulating a delay to mimic async behavior
    setTimeout(() => {
      resolve(books); // Resolve with the books data
    }, 1000); // Simulate 1 second delay
  });
}

// Route to get all books ADD NEW
public_users.get('/books', (req, res) => {
  res.status(200).json(books);
});

public_users.post("/register", (req,res) => {
  //Write your code here
  // Retrieve the username and password from the request body
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  const existingUser = users.find(user => user.username === username);

  if (existingUser) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register the new user
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop 

// Without AXIOS
// public_users.get('/',function (req, res) {
//   //Write your code here
//   // Return the list of books as a neatly formatted JSON
//   return res.status(200).send(JSON.stringify(books, null, 2));
//   // return res.status(300).json({message: "Yet to be implemented"});
// });

// Task 10: Get the list of books using Async-Await with Axios
public_users.get('/', async function (req, res) {
  try {
    // Using Axios to fetch the list of books from the server
    const response = await axios.get('http://localhost:3333/books');
    res.status(200).json({
      message: "Books fetched successfully",
      books: response.data
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching books",
      error: error.message
    });
  }
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   // Retrieve the ISBN from the request parameters
//   const isbn = req.params.isbn;

//   // Check if the book with the given ISBN exists in the books object
//   const book = books[isbn];

//   if (book) {
//     // If the book exists, return the book details
//     return res.status(200).json(book);
//   } else {
//     // If the book does not exist, return an error message
//     return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
//   }
//   // return res.status(300).json({message: "Yet to be implemented"});
//  });

 // Task 11: Get the book details based on ISBN using Async-Await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:3333/books/${isbn}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({
      message: `Book with ISBN ${isbn} not found`,
      error: error.message
    });
  }
});

  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   // Retrieve the author from the request parameters
//   const author = req.params.author.toLowerCase();

//   // Get all books and filter those that match the author
//   const booksByAuthor = Object.values(books).filter(book => 
//     book.author.toLowerCase() === author
//   );

//   if (booksByAuthor.length > 0) {
//     // Return the list of books by the specified author
//     return res.status(200).json(booksByAuthor);
//   } else {
//     // If no books are found by the author, return an error message
//     return res.status(404).json({ message: `No books found by author ${req.params.author}` });
//   }
//   // return res.status(300).json({message: "Yet to be implemented"});
// });

// Task 12: Get the book details based on Author using Async-Await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();
  try {
    const response = await axios.get(`http://localhost:3333/books?author=${author}`);
    const booksByAuthor = Object.values(response.data).filter(book =>
      book.author.toLowerCase() === author
    );

    if (booksByAuthor.length > 0) {
      res.status(200).json(booksByAuthor);
    } else {
      res.status(404).json({ message: `No books found by author ${author}` });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error fetching books by author",
      error: error.message
    });
  }
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   // Retrieve the title from the request parameters
//   const title = req.params.title.toLowerCase();

//   // Get all books and filter those that match the title
//   const booksByTitle = Object.values(books).filter(book => 
//     book.title.toLowerCase() === title
//   );

//   if (booksByTitle.length > 0) {
//     // Return the list of books with the specified title
//     return res.status(200).json(booksByTitle);
//   } else {
//     // If no books are found with the title, return an error message
//     return res.status(404).json({ message: `No books found with title ${req.params.title}` });
//   }
//   // return res.status(300).json({message: "Yet to be implemented"});
// });

// Task 13: Get the book details based on Title using Async-Await with Axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title.toLowerCase();
  try {
    const response = await axios.get(`http://localhost:3333/books?title=${title}`);
    const booksByTitle = Object.values(response.data).filter(book =>
      book.title.toLowerCase() === title
    );

    if (booksByTitle.length > 0) {
      res.status(200).json(booksByTitle);
    } else {
      res.status(404).json({ message: `No books found with title ${title}` });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error fetching books by title",
      error: error.message
    });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Check if the book with the given ISBN exists
  const book = books[isbn];

  if (book) {
    // If the book exists, return the reviews
    return res.status(200).json(book.reviews);
  } else {
    // If the book does not exist, return an error message
    return res.status(404).json({ message: `No reviews found for book with ISBN ${isbn}` });
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
