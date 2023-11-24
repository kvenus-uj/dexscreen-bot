const fs = require("fs");
const { checkMEV, getTrading, checkFresh } = require("../utils/subgraph");
const { getTopWalletAddress } = require("./getTopTraderfromURL");
const { minProfit, winRate, minPnl } = require("../config/config.js");
const { sendWalletMessage } = require("./messages.js");

const getWallets = async (lpData) => {
  let existWallets = [];
  const filepath = "./walletData.json";
  if (fs.existsSync(filepath)) {
    const fileContent = fs.readFileSync(filepath, "utf8");
    if (fileContent.trim().length > 0) {
      existWallets = JSON.parse(fileContent);
    } else {
      existWallets = [];
    }
  } else {
    existWallets = [];
  }

  for (let i = 0; i < lpData.length; i++) {
    console.log(`Checking traders for ${lpData[i].pool_address} ${i}/${lpData.length}`)
    const wallets = await getTopWalletAddress(lpData[i].pool_address);
    let newWallets = [];
    for (let index = 0; index < wallets.length; index++) {
      const notified = existWallets.some(wallet => wallet.address === wallets[index]);
      console.log(wallets[index], notified);
      if (!notified) {
        newWallets.push({
          address: wallets[index],
          top_rate: index + 1,
          token_name: lpData[i].symbol,
          token_address: lpData[i].address,
          profit_rate: 0,
        });
      }
    }
    let checkedWallets = [];
    for (let index = 0; index < newWallets.length; index++) {

      const mev = await checkMEV(newWallets[index].address, lpData[i].version);
      if (!mev) {
        checkedWallets.push(newWallets[index]);
      }
    }
    // console.log('Completed check MEV bot');
    if (checkedWallets.length > 0) {
      for (let j = 0; j < checkedWallets.length; j++) {
        const freshWallet = await checkFresh(
          checkedWallets[j].address,
          lpData[i].version
        );

        let reason = "";
        let passed = false;
        if (freshWallet) {
          reason = "Fresh wallet in Top trades";
          passed = true;
        } else {
          const TradingState = await getTrading(
            lpData[i].pool_address,
            checkedWallets[j].address,
            lpData[i].address,
            lpData[i].version
          );
          if (TradingState.totalTrades > 0) {
            if (TradingState.totalProfit / TradingState.totalBuy >= minProfit) {
              passed = true;
              reason = ` Average profit is $${(TradingState.totalProfit / TradingState.totalTrades).toFixed(2)}`;
            }
            if (TradingState.winRate >= winRate) {
              if (passed) reason = reason + ",";
              passed = true;
              reason = reason + ` Win rate is ${TradingState.winRate.toFixed(2)}%`;
            }
            if (TradingState.totalProfit_roi * 100 >= minPnl) {
              if (passed) reason = reason + ",";
              passed = true;
              reason = ` Total PNL by roi is ${(TradingState.totalProfit_roi * 100).toFixed(2)}%`;
            }
          }
        }
        if (passed) {
          console.log({ reason, passed, address: checkedWallets[j].address })
          checkedWallets[j].reason = reason;
          existWallets.push(checkedWallets[j]);
          sendWalletMessage(checkedWallets[j]);
        }
      }
    }
  }
  return existWallets;
};

module.exports = {
  getWallets,
};
