const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

// MongoDB connection
mongoose.connect('mongodb+srv://senthil3226w:senthil3226w@masterdb.sgaxw.mongodb.net/?retryWrites=true&w=majority&appName=masterdb')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
