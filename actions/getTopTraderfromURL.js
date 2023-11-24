const axios = require('axios');


async function getTopWalletAddress(pool_address) {
  let options = {
    headers: {
      'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0"
    }
  }

  return axios.get(`https://io.dexscreener.com/dex/log/amm/v2/uniswap/top/ethereum/${pool_address}?q=0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`, options)
    .then((resp) => {
      const data = resp.data;
      let match;
      let matches = [];
      const regexPattern = /0x[a-fA-F0-9]{40}\b/g;
      while ((match = regexPattern.exec(data)) !== null) {
        matches.push(match[0]);

        if (matches.length === 50) {
          break;
        }
      }
      return matches;
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
}
module.exports = {
  getTopWalletAddress,
};