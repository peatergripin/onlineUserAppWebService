const express = require("express");
const mysql = require("mysql2/promise");
require("dotenv").config();
const PORT = 3000;

// database config info
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
};

const app = express();

app.use(express.json());

// Start Server
app.listen(PORT, () => console.log("Server running on port", PORT));

// // Example Route: Get all users
// app.get("/allusers", async (req, res) => {
//   try {
//     let connection = await mysql.createConnection(dbConfig);
//     const [rows] = await connection.execute("SELECT * FROM defaultdb.users");
//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error for allusers" });
//   }
// });

// ------- GET ROUTE -------
app.get("/users", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM defaultdb.users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

app.get("/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM defaultdb.users WHERE userid = ?",
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch user with id: " + userId });
  }
});

// // Example Route: Create a new user
// app.post("/adduser", async (req, res) => {
//   const { fullName, email, phoneNumber } = req.body;
//   try {
//     let connection = await mysql.createConnection(dbConfig);
//     await connection.execute(
//       "INSERT INTO defaultdb.users (fullName, email, phoneNumber) VALUES (?,?,?)",
//       [fullName, email, phoneNumber]
//     );
//     res
//       .status(201)
//       .json({ message: "User " + fullName + " added successfully" });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ message: "Server error - could not add user " + fullName });
//   }
// });

// ------- CREATE ROUTE -------
app.post("/users", async (req, res) => {
  const { fullName, email, phoneNumber } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      "INSERT INTO defaultdb.users (fullName, email, phoneNumber) VALUES (?, ?, ?)",
      [fullName, email, phoneNumber]
    );

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create user" });
  }
});

// // Edit user
// app.post("/edituser/:id", async (req, res) => {
//   const user_id = parseInt(req.params.id);
//   const { fullName, email, phoneNumber } = req.body;
//   try {
//     let connection = await mysql.createConnection(dbConfig);
//     //'UPDATE products SET productName = ? , quantity = ?, price = ?, image =? WHERE productId = ?'
//     await connection.execute(
//       "UPDATE users SET fullName = ?, email = ?, phoneNumber = ? WHERE userid = ?",
//       [fullName, email, phoneNumber, user_id]
//     );
//     res
//       .status(201)
//       .json({ message: "User " + fullName + " added successfully" });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ message: "Server error - could not add user " + fullName });
//   }
// });

// ------- UPDATE ROUTE -------
app.put("/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const { fullName, email, phoneNumber } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      "UPDATE defaultdb.users SET fullName=?, email=?, phoneNumber=? WHERE userid=?",
      [fullName, email, phoneNumber, userId]
    );

    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
});

// // Delete user
// app.post("/deleteuser/:id", async (req, res) => {
//   const user_id = parseInt(req.params.id);
//   try {
//     let connection = await mysql.createConnection(dbConfig);
//     await connection.execute("DELETE FROM defaultdb.users WHERE userid=?", [
//       user_id,
//     ]);
//     res
//       .status(201)
//       .json({ message: "User " + fullName + " successfully deleted" });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ message: "Server error - could not remove user " + fullName });
//   }
// });

// ------- DELETE ROUTE -------
app.delete("/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute("DELETE FROM defaultdb.users WHERE userid=?", [
      userId,
    ]);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});
