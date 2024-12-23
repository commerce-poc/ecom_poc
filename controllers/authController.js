const db = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = 'your_jwt_secret_key';

exports.register = async (req) => {
  try {
    // Destructure and validate request payload
    const { username, password } = req;
    if (!username || !password) {
      console.error('Error: Username and password are required.');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // SQL query to insert user
    const sql = 'INSERT INTO admin_user (username, password) VALUES ($1, $2)';

    // Execute the query
    await db.query(sql, [username, hashedPassword]);

    // Log success message
    console.log('admin user created successfully!');
  } catch (error) {

    // Handle specific errors
    if (error.code === '23505') {
      console.error('Error: Username already exists.');
    } else {
      console.error(error.detail);
    }
  }
  
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query the database to find the user by username
    const sql = 'SELECT * FROM admin_user WHERE username = $1';
    const { rows } = await db.query(sql, [username]);

    // If no user found, return an error message
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials: Username not found' });
    }

    const user = rows[0];

    // Compare the provided password with the stored hash
    const match = await bcrypt.compare("xyz",password);
    console.log("match:",match)
    return;
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials: Incorrect password' });
    }

    // Generate JWT token if credentials are correct
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

    // Return the token in the response
    return res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error, please try again later' });
  }
};
