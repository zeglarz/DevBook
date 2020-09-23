const express = require('express');
const app = express();
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 8080;

//Connect DB

connectDB();

// Init Middleware
app.use(express.json({ extended: false }));


app.listen(PORT, () => console.log(`server started on port ${PORT}`));

//Serve static assets in production


// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));


