export type Environment = "testnet" | "mainnet";

export type Subgraph = {
  chain: {
    name: string;
    identifier: string;
    id: string;
    environment: Environment;
  };
  name: string;
  version: string;
};

export const subgraphList: Subgraph[] = [
  {
    name: "sp-bnb",
    version: "v1.1.2",
    chain: {
      name: "bsc",
      identifier: "v1",
      id: "56",
      environment: "mainnet",
    },
  },
  {
    name: "sp-zetachain",
    version: "v1.1.0",
    chain: {
      name: "zetachain",
      identifier: "v1",
      id: "7000",
      environment: "mainnet",
    },
  },
  {
    name: "sp-zetachain",
    version: "v1.0.0",
    chain: {
      name: "zetachain",
      identifier: "v0",
      id: "7000",
      environment: "mainnet",
    },
  },
  {
    name: "sp-arbitrum-one",
    version: "v1.1.0",
    chain: {
      name: "arbitrum",
      identifier: "v1",
      id: "42161",
      environment: "mainnet",
    },
  },
  {
    name: "sp-berachain-testnet",
    version: "v1.1.0",
    chain: {
      name: "berachainTestnet",
      identifier: "v1",
      id: "80085",
      environment: "testnet",
    },
  },
  {
    name: "sp-cyber",
    version: "v1.1.0",
    chain: {
      name: "cyber",
      identifier: "v1",
      id: "7560",
      environment: "mainnet",
    },
  },
  {
    name: "sp-x1",
    version: "v1.1.0",
    chain: {
      name: "xLayer",
      identifier: "v1",
      id: "196",
      environment: "mainnet",
    },
  },
  {
    name: "sp-gnosis",
    version: "v1.1.0",
    chain: {
      name: "gnosis",
      identifier: "v1",
      id: "100",
      environment: "mainnet",
    },
  },
  {
    name: "sp-degen",
    version: "v1.1.0",
    chain: {
      name: "degen",
      identifier: "v1",
      id: "999999999",
      environment: "mainnet",
    },
  },
  {
    name: "sp-arbitrum-sepolia",
    version: "v1.1.0",
    chain: {
      name: "arbitrumSepolia",
      identifier: "v1",
      id: "421614",
      environment: "testnet",
    },
  },
  {
    name: "sp-gnosis-chiado",
    version: "v1.1.0",
    chain: {
      name: "gnosisChiado",
      identifier: "v1",
      id: "10200",
      environment: "testnet",
    },
  },
  {
    name: "sp-op",
    version: "v1.1.0",
    chain: {
      name: "optimism",
      identifier: "v1",
      id: "10",
      environment: "mainnet",
    },
  },
  {
    name: "sp-op-sepolia",
    version: "v1.1.0",
    chain: {
      name: "optimismSepolia",
      identifier: "v1",
      id: "11155420",
      environment: "testnet",
    },
  },
  {
    name: "sp-amoy",
    version: "v1.1.0",
    chain: {
      name: "polygonAmo",
      identifier: "v1",
      id: "80002",
      environment: "testnet",
    },
  },
  {
    name: "sp-sepolia",
    version: "v1.1.0",
    chain: {
      name: "sepolia",
      identifier: "v1",
      id: "11155111",
      environment: "testnet",
    },
  },
  {
    name: "sp-plume-sepolia",
    version: "v1.1.0",
    chain: {
      name: "plumeTestnet",
      identifier: "v1",
      id: "161221135",
      environment: "testnet",
    },
  },
  {
    name: "sp-scroll-sepolia",
    version: "v1.1.0",
    chain: {
      name: "scrollSepolia",
      identifier: "v1",
      id: "534351",
      environment: "testnet",
    },
  },
  {
    name: "sp-base-sepolia",
    version: "v1.1.0",
    chain: {
      name: "baseSepolia",
      identifier: "v1",
      id: "84532",
      environment: "testnet",
    },
  },
  {
    name: "sp-base",
    version: "v1.1.0",
    chain: {
      name: "base",
      identifier: "v1",
      id: "8453",
      environment: "mainnet",
    },
  },
  {
    name: "sp-scroll",
    version: "v1.1.0",
    chain: {
      name: "scroll",
      identifier: "v1",
      id: "534352",
      environment: "mainnet",
    },
  },
  {
    name: "sp-mumbai-testnet",
    version: "v1.1.0",
    chain: {
      name: "polygonMumbai",
      identifier: "v1",
      id: "80001",
      environment: "testnet",
    },
  },
  {
    name: "sp-opbnb",
    version: "v1.1.0",
    chain: {
      name: "opBNB",
      identifier: "v1",
      id: "204",
      environment: "mainnet",
    },
  },
  {
    name: "sp-opbnb-testnet",
    version: "v1.1.0",
    chain: {
      name: "opBNBTestnet",
      identifier: "v1",
      id: "5611",
      environment: "testnet",
    },
  },
  {
    name: "sp-matic",
    version: "v1.1.0",
    chain: {
      name: "polygon",
      identifier: "v1",
      id: "137",
      environment: "mainnet",
    },
  },
  {
    name: "sp-ethereum",
    version: "v1.1.0",
    chain: {
      name: "mainnet",
      identifier: "v1",
      id: "1",
      environment: "mainnet",
    },
  },
  {
    name: "sp-zetachain-testnet",
    version: "v1.0.0",
    chain: {
      name: "zetachainAthensTestnet",
      identifier: "v1",
      id: "7001",
      environment: "testnet",
    },
  },
];
