const express = require("express");
const { v4 } = require("uuid");
const w3 = require("../connection");
const {addOrder} = require("../controllers/insertOrder");
const { checkOwnerWithId, getAmount } = require("../controllers/addOwner");
const {
  addPendingTxn,
  getPendingTransactions,
} = require("../balanceChecker/pendingTxns");

const router = express.Router();

const generateWallet = () => {
  const addressObj = w3.eth.accounts.create();
  return addressObj.address;
};

const validateOwner = async (req, res, next) => {
  try {
    const { OwnerId } = req.body;
    if (!OwnerId) {
      return res
        .status(400)
        .json({ message: "OwnerName is required", status: false });
    }

    const exists = await checkOwnerWithId(OwnerId);
    if (exists) {
      return next();
    }

    res.status(403).json({ message: "Invalid Owner", status: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "There was some error", status: false });
  }
};

router.post("/", validateOwner, async (req, res) => {
  const address = generateWallet();
  const orderId = v4();
  const { OwnerId } = req.body;
  const amount = await getAmount(OwnerId);
  try {
    const savedOrder = await addOrder(orderId, address, OwnerId, false);
    if (savedOrder) {
      res.json({
        address,
        orderId,
        status: true,
        amount,
      });
      addPendingTxn(address, amount);
      console.log(getPendingTransactions());
    } else {
      res.status(500).json({
        status: false,
        message:
          "There was an error generating the wallet address. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error in addOrder:", error);
    res.status(500).json({
      status: false,
      message:
        "There was an error generating the wallet address. Please try again.",
    });
  }
});

module.exports = router;
