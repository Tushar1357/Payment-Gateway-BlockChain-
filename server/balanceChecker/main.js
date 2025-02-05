const w3 = require('../connection');
const { usdtAddress, tokenAbi } = require('../config');
const ethers = require('ethers');
const { getPendingTransactions, removeTransaction } = require("./pendingTxns");
const {broadCastMessage} = require('../socket/main');
const { changePaymentStatus } = require('../controllers/insertOrder');

const checkBalance = async () => {
  try{
  const usdtContract = new w3.eth.Contract(tokenAbi, usdtAddress);

  setInterval(async () => {
    const transactions = getPendingTransactions()

    for (const [address, amount] of transactions) {
      const balance = await usdtContract.methods.balanceOf(address).call();
      const formatBalance = parseFloat(ethers.formatUnits(balance, 18));

      if (formatBalance >= amount) {
        await changePaymentStatus(address)
        broadCastMessage(address)
        console.log(`Success: Payment received for ${address}`);
        removeTransaction(address);
      }
    }
  }, 15000);
}
catch(error){
  console.log(error)
}
};

module.exports = checkBalance
