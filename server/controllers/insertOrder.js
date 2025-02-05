const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.connectionURL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  OwnerId: { type: String, required: true },
  status: { type: Boolean, required: true },
  amount: {type: Number, requierd: true},
  Date: { type: Date, default: Date.now },
});

const Payment = mongoose.model("Payment", paymentSchema);

const addOrder = async (orderId, address, OwnerId, status,amount) => {
  try {
    const newOrder = new Payment({ orderId, address, OwnerId, status,amount });
    await newOrder.save();
    return true;
  } catch (error) {
    return false;
  }
};

const changePaymentStatus = async (address) => {
  try{
    const result = Payment.findOne({address});
    if (result) {
      const updatedResult = await Payment.updateOne({address},{status: true})
      return true;
    }
  }
  catch(error){
    return null
  }
}
module.exports = {addOrder, changePaymentStatus};
