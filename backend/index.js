
const express = require("express");
const authRoutes = require("./routes/authentication");
const bookRoutes = require("./routes/bookRecords")
const cors = require("cors"); 
require("dotenv").config();
const db = require('./database/models/index');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

db.sequelize.authenticate().then(() => {
  console.log('Connected to the database');
})
.catch(err => {
  console.error('Error while connecting to the database:', err);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});