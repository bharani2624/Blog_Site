const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'auth_db' 
});


const SECRET_KEY = "12345678902";


app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
    db.query(sql, [email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }
        return res.status(201).json({ message: "User registered successfully!" });
    });
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

       
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
            expiresIn: "1h",
        });
        return res.status(200).json({ message: "Login successful", token });
    });
});




app.get('/blogs', (req, res) => {
    const sql = "SELECT * FROM blogs";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return res.json(data);
    });
});


app.get('/blogs/user/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = "SELECT * FROM blogs WHERE user_id = ?";
    db.query(sql, [userId], (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return res.json(data);
    });
});

app.post('/blogs', (req, res) => {
    const { title, content, user_id } = req.body;
    const sql = "INSERT INTO blogs (title, content, user_id) VALUES (?, ?, ?)";
    db.query(sql, [title, content, user_id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        return res.json({ message: "Blog created successfully", id: result.insertId });
    });
});


app.put('/blogs/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const sql = "UPDATE blogs SET title = ?, content = ? WHERE id = ?";
    db.query(sql, [title, content, id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        return res.json({ message: "Blog updated successfully" });
    });
});


app.delete('/blogs/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM blogs WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        return res.json({ message: "Blog deleted successfully" });
    });
});



app.get('/blogs', (req, res) => {
    const sql = "SELECT blogs.id, blogs.title, blogs.content, users.email AS author FROM blogs JOIN users ON blogs.user_id = users.id";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return res.json(data);
    });
});


app.listen(8081, () => {
    console.log("ABD STARTED TO CONQUER");
});
