const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  UserName: {type: String, required: true, unique: true},
  OwnerAddress: {type: String, required: true},
  amount: {type: Number, required: true},
  OwnerId: {type: String, required: true, unique: true},
  Date: {type: Date, default: Date.now}
})

const model = mongoose.model("Owners",schema,"owners")

const checkOwner = async (UserName) => {
  try{
    const result = await model.findOne({UserName})
    if (result){
      return true;
    }
    return false
  }
  catch(error) {
    console.log(error)
    return null;
  }
}

const getAmount = async (OwnerId) => {
  try{
    const result = await model.findOne({OwnerId})
    if (result){
      return result.amount;
    }
    return false
  }
  catch(error) {
    console.log(error)
    return null;
  }
}

const checkOwnerWithId = async (OwnerId) => {
  try{
    const result = await model.findOne({OwnerId})
    if (result){
      return true;
    }
    return false
  }
  catch(error) {
    console.log(error)
    return null;
  }
}

const addOwner = async (UserName, OwnerAddress,amount,OwnerId) => {
  try{
    if (!(await checkOwner(UserName))){
      const newOwner = new model({UserName, OwnerAddress,amount, OwnerId})
      await newOwner.save();
      return {
        status: true,
        message: "Account created."
      }
    }
    else{
      return {
        status: false,
        message: "Username already exits"
      };
    }
  }
  catch(error){
    console.log(error)
    return {
      status: false,
      message: "There was some error"
    }
  }
}

module.exports = {checkOwner,checkOwnerWithId, addOwner, getAmount};