const { start_get_pool } = require("./actions/get_pools");
const { getWallets } = require("./actions/get_wallets");
const { saveLpAddress, saveWalletsAddress } = require("./actions/actionJSON");
//const lpData = require('./lpData.json')
async function prepareData() {
  console.log("Getting pools")
  const pools = await start_get_pool();
  const lpData = saveLpAddress(pools);
  if (lpData) {
    const wallets = await getWallets(lpData);
    saveWalletsAddress(wallets);
  }
}

module.exports = {
  prepareData,
};
