const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: String,
  number: { type: String, unique: true },
  email: String,
  image: String,
});

module.exports = mongoose.model("contacts", contactSchema);
