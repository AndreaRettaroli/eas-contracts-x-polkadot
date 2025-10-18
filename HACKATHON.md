# Contract Verification Commands for Asset Hub Testnet

## Project description

In this project we decided to migrate [Ethereum Attestation Service](https://attest.org/) contract on Polkadot Testnet Paseo as part of the [Polkadot Porting Existing Smart Contracts](https://ethrome25.notion.site/Prizes-and-Bounties-160d00c099af81aba88cd436e7acf94f) track of [EthRome2025](https://www.ethrome.org/).

## Comparative Analysis

Functionalities are entirely preserved and migrated.

## Working Deployment

### Verify SchemaRegistry Contract

Explorer link: https://blockscout-passet-hub.parity-testnet.parity.io/address/0x3cbd4DD4617e2aF95c5b451b1c9a3ab16E23b4a1

```bash
npx hardhat verify --network asset-hub-testnet 0x3cbd4DD4617e2aF95c5b451b1c9a3ab16E23b4a1
```

### Verify EAS Contract

Explorer link: https://blockscout-passet-hub.parity-testnet.parity.io/address/0x66e45E407B1159F126e76aeF9DbFf426952b2e15

```bash
npx hardhat verify --network asset-hub-testnet 0x66e45E407B1159F126e76aeF9DbFf426952b2e15 0x3cbd4DD4617e2aF95c5b451b1c9a3ab16E23b4a1
```

### Verify EIP712Proxy Contract

Explorer link: https://blockscout-passet-hub.parity-testnet.parity.io/address/0x592FCDB8439E5D11AC5117472E89f63289b47899

```bash
npx hardhat verify --network asset-hub-testnet 0x592FCDB8439E5D11AC5117472E89f63289b47899 0x3cbd4DD4617e2aF95c5b451b1c9a3ab16E23b4a1 "2CEIP712Proxy"
```

### Verify Indexer Contract

Explorer link: https://blockscout-passet-hub.parity-testnet.parity.io/address/0xd64b14E3bC71439eD2106e0Af2a610aac0357383

```bash
npx hardhat verify --network asset-hub-testnet 0xd64b14E3bC71439eD2106e0Af2a610aac0357383 0x3cbd4DD4617e2aF95c5b451b1c9a3ab16E23b4a1
```
### Setup instructions

#### Wallet setup

you need a wallet to deploy the contracts.

```
pnpm i viem --dev
pnpm run generate-wallet
```
Take the address in the console and use it in the [fauced](https://faucet.polkadot.io/) to get founds on Paseo testnet.

Take the private key and create a `.env` file folliwing the `.env.example` style and replace the `PRIVATE_KEY=<your-private-key>` with the private key.

#### Compile contract

```
pnpm compile
```

#### Deploy
```
npx hardhat run scripts/deploy.js --network paseoAssetHub
```

result: 
 
#### 

#### Link to source smart contracts source code

[eas-contracts](https://github.com/ethereum-attestation-service/eas-contracts)

