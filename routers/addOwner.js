const express = require("express");
const { checkOwner, addOwner } = require("../controllers/addOwner");
const {Web3} = require('web3')
const {v4} = require('uuid')
const router = express.Router();

const validateOwner = async (req, res, next) => {
  try {
    const { OwnerName } = req.body;
    if (!OwnerName) {
      return res
        .status(400)
        .json({ message: "OwnerName is required", status: false });
    }

    const exists = await checkOwner(OwnerName);
    if (!exists) {
      return next();
    }

    res
      .status(403)
      .json({ message: "OwnerName already exists", status: false });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "There was some error", status: false });
  }
};

router.post("/", validateOwner, async (req, res) => {
  try {
    const { OwnerName, address,amount } = req.body;

    if (!OwnerName || !address || !amount) {   
        return res.status(400).json({
          message: "OwnerName, address and amount are required",
          status: false,
        });
    }

    if (address.startsWith("0x") && address.length == 42){
      const OwnerId = v4();
      const result = await addOwner(OwnerName, Web3.utils.toChecksumAddress(address),amount ,OwnerId);
      return res.json({ message: result.message, status: result.status, OwnerId });
    }
    else {
      return res.status(400).json({
        message: "Invalid Address",
        status: false,
      });
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "There was some error", status: false });
  }
});

module.exports = router;
