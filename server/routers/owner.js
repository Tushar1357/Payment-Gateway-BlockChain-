const express = require("express");
const { checkOwner } = require("../controllers/addOwner");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { MerchantName } = req.body;
    if (!MerchantName) {
      return res
        .status(400)
        .json({ message: "Merchant name is required", status: false });
    }

    const exists = await checkOwner(MerchantName);
    if (exists) {
      return res.status(200).json({ message: exists.MerchantId, status: true });
    }

    res
      .status(403)
      .json({ message: "No merchant found with this name", status: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "There was some error", status: false });
  }
});

module.exports = router;
