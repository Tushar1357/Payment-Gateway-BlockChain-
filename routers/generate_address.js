const express = require("express");
const { v4 } = require("uuid");
const w3 = require("../connection");
const addOrder = require("../controllers/insertOrder");

const router = express.Router();

const generateWallet = () => {
  const addressObj = w3.eth.accounts.create();
  return addressObj.address;
};

const validateOwner = (req, res, next) => {
  const { ownerId } = req.body;
  if (checkOwner(ownerId)) {
    return next();
  }
  res.status(403).json({ message: "Invalid Owner", status: false });
};

router.get("/", async (req, res) => {
  const address = generateWallet();
  const orderId = v4();

  try {
    const savedOrder = await addOrder(orderId, address,false);
    if (savedOrder) {
      res.json({
        address,
        orderId,
        status: true,
      });
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
