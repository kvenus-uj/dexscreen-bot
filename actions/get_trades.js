const { getTrading } = require("../utils/subgraph");

const filter_wallets = async (
  lpAddress,
  traderAddress,
  tokenAddress,
  version
) => {
  const traderData = await getTrading(
    lpAddress,
    traderAddress,
    tokenAddress,
    version
  );
  return {
    ...traderData,
    top_state: traderData.topTraderState,
    reason:traderData.reason,
    profit_rate: traderData.profitRate,
  };
};

module.exports = {
  filter_wallets,
};
