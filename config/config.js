const { ApolloClient } = require("apollo-boost");
const { fetch } = require("cross-fetch/polyfill");
const { InMemoryCache } = require("apollo-cache-inmemory");
const { createHttpLink } = require("apollo-link-http");

const subgraph = {
  1: {
    2: "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v2-dev",
    3: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
  },
};

module.exports = {
  tg_api: "6541860767:AAHi65eyMtImEfTQQAgGkvBdJW-MJTW4qOY",
  chat_id: -4045814241, //4085571318,
  morails_key:
    "3pPLbAJU77QC0ASflpRvGVCWEjHNSCpwT3k7OtrhSMo2iYo4Y2GykSLtQtlyfBYO",
  duneapikey: "umYKvUbhI4m7xCJMFmj7qQo0QNvozglu",
  etherscankey: "RZJ3AXFEQTP3TZB43RJJHYNXE6338VSCVW",
  wss: {
    [1]: "wss://mainnet.infura.io/ws/v3/c558761fd1204a879c54d5187f0ef53f",
  },
  APPOLO: (chainId, version) => {
    const defaultOptions = {
      watchQuery: {
        fetchPolicy: "no-cache",
        errorPolicy: "ignore",
      },
      query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
    };
    return new ApolloClient({
      link: createHttpLink({
        uri: subgraph[chainId][version],
        fetch: fetch,
      }),
      cache: new InMemoryCache(),
      defaultOptions: defaultOptions,
    });
  },
  launchtime: 24,
  minlp: 1,
  maxlp: 100,
  minbuys: 10,
  minsells: 10,
  limitMCap: 500000,
  pnlLimit: 1000,
  trade_ago_days: 60,
  minProfit: 5000,
  winRate: 80,
  minPnl: 3000,
  firstProfit: 2000,
};
