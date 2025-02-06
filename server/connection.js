const { Web3 } = require("web3");

const web3 = () => {
  try {
    const w3 = new Web3("https://rpc.ankr.com/bsc");
    return w3;
  } catch (error) {
    console.log(error);
  }
};

module.exports = web3;
