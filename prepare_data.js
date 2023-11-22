const { start_get_pool } = require("./actions/get_pools");
const { getWallets } = require("./actions/get_wallets");
const { saveLpAddress, saveWalletsAddress } = require("./actions/actionJSON");
//const lpData = require('./lpData.json')
async function prepare_data() {
  const pools = await start_get_pool();
  const lpData = saveLpAddress(pools);
  if (lpData) {
    const wallets = await getWallets(lpData);
    saveWalletsAddress(wallets);
  }
}

module.exports = {
  prepare_data,
};
