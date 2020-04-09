var mongoose = require("mongoose");

var clientSchema = new mongoose.Schema({
  name: String,
  email: String,
  number: String,
  propic: String,
  cases: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
    },
  ],
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  invoices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
    },
  ],
});

module.exports = mongoose.model("Client", clientSchema);
