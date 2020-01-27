const express = require("express");
const app = express();
const mongoose = require("./db/mongoose");
const userRoutes = require("./routes/user-routes");
const bodyParser = require("body-parser");
const private = require("./routes/private");
const stepRouter = require("./routes/step-routes");

// app.use(bodyParser.json());
app.use(express.json({ extended: false }));

app.use("/images", express.static("images"));

app.use("/user", userRoutes);
app.use("/private", private);
app.use("/step", stepRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`server start on port ${PORT} `);
});
