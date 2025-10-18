import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-solhint';
import 'hardhat-contract-sizer';
import { HardhatUserConfig } from 'hardhat/config';
import { MochaOptions } from 'mocha';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

interface EnvOptions {
  PROFILE?: boolean;
}

const { PROFILE: isProfiling }: EnvOptions = process.env as any as EnvOptions;

const mochaOptions = (): MochaOptions => {
  let timeout = 600000;
  let reporter;

  if (isProfiling) {
    timeout = 0;
    reporter = 'mocha-silent-reporter';
  }

  return {
    timeout,
    color: true,
    bail: true,
    reporter
  };
};

const config: HardhatUserConfig = {
 etherscan: {
  apiKey: {
    'passet-hub': 'empty'
  },
  customChains: [
    {
      network: "passet-hub",
      chainId: 420420421,
      urls: {
        apiURL: "https://blockscout-passet-hub.parity-testnet.parity.io/api",
        browserURL: "https://blockscout-passet-hub.parity-testnet.parity.io"
      }
    }
  ]
 },
  networks: {
    hardhat: {
      accounts: {
        count: 20,
        accountsBalance: '10000000000000000000000000000000000000000000000'
      },
      allowUnlimitedContractSize: true
    },
    paseoAssetHub: {
      url: "https://testnet-passet-hub-eth-rpc.polkadot.io",
      chainId: 420420422, // Paseo Asset Hub chain ID
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],

    },
    'passet-hub': {
      url: 'https://blockscout-passet-hub.parity-testnet.parity.io/api/eth-rpc',
    },
  },
  solidity: {
    version: '0.8.28',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000000
      },
      evmVersion: 'paris', // Prevent using the `PUSH0` opcode
      metadata: {
        bytecodeHash: 'none' // Remove the metadata hash from the bytecode
      }
    }
  },

  typechain: {
    target: 'ethers-v6'
  },

  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    disambiguatePaths: false
  },

  gasReporter: {
    currency: 'USD',
    enabled: isProfiling
  },

  mocha: mochaOptions(),

};

export default config;
