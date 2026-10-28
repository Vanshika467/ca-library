const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bookRoutes = require("./routes/books.routes");

 dotenv.config();

 const app = express();
 app.use(express.json());

 app.use("/api/books", bookRoutes);

    app.get("/", (req, res) => {
    res.send("Library  API is running");
    });

 const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI).then(() => {
     console.log("MongoDB connected....");
     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   })
   .catch((err) => console.error("MongoDB connection error:", err.message));