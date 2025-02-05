const pendingTxns = new Map();

module.exports = {
  pendingTxns, 
  addPendingTxn: (address, amount) => pendingTxns.set(address, amount),
  getPendingTransactions: () => Array.from(pendingTxns.entries()),
  removeTransaction: (address) => pendingTxns.delete(address)
};
