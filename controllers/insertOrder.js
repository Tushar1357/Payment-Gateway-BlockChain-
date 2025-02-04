const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.connectionURL).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  status: {type: Boolean, required: true}
});

const Payment = mongoose.model("Payment", paymentSchema);

const addOrder = async (orderId, address,status) => {
  try {
    const newOrder = new Payment({ orderId, address,status });
    await newOrder.save();
    return true;
  } catch (error) {
    return false
  }
};

module.exports = addOrder; 
