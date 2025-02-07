const express = require("express");
const { v4 } = require("uuid");
const web3 = require("../connection");
const { addOrder } = require("../controllers/insertOrder");
const { checkOwnerWithId, getAmount } = require("../controllers/addOwner");
const {
  addPendingTxn,
  getPendingTransactions,
} = require("../balanceChecker/pendingTxns");

const w3 = web3();
const router = express.Router();

const generateWallet = () => {
  const addressObj = w3.eth.accounts.create();
  return addressObj.address;
};

const validateOwner = async (req, res, next) => {
  try {
    const { MerchantId } = req.body;
    if (!MerchantId) {
      return res
        .status(400)
        .json({ message: "Merchant is required", status: false });
    }

    const exists = await checkOwnerWithId(MerchantId);
    if (exists) {
      req.body["UserName"] = exists.UserName;
      return next();
    }

    res.status(403).json({ message: "Invalid Merchant", status: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "There was some error", status: false });
  }
};

router.post("/", validateOwner, async (req, res) => {
  const address = generateWallet();
  const orderId = v4();
  const { MerchantId, UserName } = req.body;
  const amount = await getAmount(MerchantId);
  try {
    const savedOrder = await addOrder(orderId, address, MerchantId, false);
    if (savedOrder) {
      res.json({
        orderId,
        Merchant: UserName,
        address,
        amount,
        status: true,
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
