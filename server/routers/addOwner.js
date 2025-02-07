const express = require("express");
const { checkOwner, addOwner } = require("../controllers/addOwner");
const { Web3 } = require("web3");
const { v4 } = require("uuid");
const router = express.Router();

const validateOwner = async (req, res, next) => {
  try {
    const { MerchantName } = req.body;
    if (!MerchantName) {
      return res
        .status(400)
        .json({ message: "MerchantName is required", status: false });
    }

    const exists = await checkOwner(MerchantName);
    if (!exists) {
      return next();
    }

    res
      .status(403)
      .json({ message: "MerchantName already exists", status: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "There was some error", status: false });
  }
};

router.post("/", validateOwner, async (req, res) => {
  try {
    const { MerchantName, address, amount } = req.body;

    if (!MerchantName || !address || !amount) {
      return res.status(400).json({
        message: "MerchantName, address and amount are required",
        status: false,
      });
    }

    if (address.startsWith("0x") && address.length == 42) {
      const MerchantId = v4();
      const result = await addOwner(
        MerchantName,
        Web3.utils.toChecksumAddress(address),
        amount,
        MerchantId
      );
      return res.json({
        message: result.message,
        status: result.status,
        MerchantId,
      });
    } else {
      return res.status(400).json({
        message: "Invalid Address",
        status: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "There was some error", status: false });
  }
});

module.exports = router;
