const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { client } = require("../config/db");

const SECRET_KEY = "s31n24s24m6sumiya@l";

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, address, phone_number, accessKey } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (name, email, password, role, address, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [name, email, hashedPassword, role, address, phone_number];
    const result = await client.query(query, values);

    res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await client.query(query, [email]);

    if (!result.rows.length) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
