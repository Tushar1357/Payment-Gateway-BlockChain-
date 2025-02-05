module.exports = {
  usdtAddress: "0x55d398326f99059fF775485246999027B3197955",
  tokenAbi: [
    {
      constant: true,
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ]
}