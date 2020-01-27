const mongoose = require("mongoose");

const Photo = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  categorie: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("photo", Photo);
