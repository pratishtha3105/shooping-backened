const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get('/',(req,res) => {
//     res.send('hello from server')
// })

// auth routes
app.use("/auth", require("./routes/auth"));
// order routes
app.use("/orders", require("./routes/order"));

// product routes
app.use("/products", require("./routes/product"));

// account routes
app.use("/users", require("./routes/users"));

// admin routes
app.use("/adminauth", require("./routes/adminAuth"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// 404 route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
