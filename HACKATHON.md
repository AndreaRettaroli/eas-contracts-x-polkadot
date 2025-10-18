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

After you deploy the contracts you can add the adresses in the `.env` file to fill in this two variables

```
# Address of the Schema Registry contract on the Polkadot Asset Hub Testnet
SCHEMA_REGISTRY_ADDRESS=

# Address of the EAS contract on the Polkadot Asset Hub Testnet
EAS_ADDRESS=
```

otherwise you can use the once of our deployment

```# Address of the Schema Registry contract on the Polkadot Asset Hub Testnet
SCHEMA_REGISTRY_ADDRESS=0x3cbd4DD4617e2aF95c5b451b1c9a3ab16E23b4a1

# Address of the EAS contract on the Polkadot Asset Hub Testnet
EAS_ADDRESS=0x66e45E407B1159F126e76aeF9DbFf426952b2e15
```

#### Attestation Scripts

Use the following scripts to test the deployed contracts.

##### Create Schema

If you redeployed the contract you can run:

run:

```
pnpm run create-schema
```

if you use our contract make sure you create a new schema editing:

```
const schemaHackathonSubmission = 'string hackathonId,string projectName,string description,address[] team,uint64 submittedDate';
```

in `scripts/create-schema.ts`

##### Verify Schema

make sure `SCHEMA_UID` is assigned in your `.env` basing on your created schema or use the default one

run:

```
pnpm run verify-schema
```

##### Create Attestation

make sure `SCHEMA_UID` is assigned in your `.env` basing on your created schema or use the default one

run:

```
pnpm run create-attestation
```

Take the attestation uid and add it to your `.env` file.

##### Verify Attestation

make sure `ATTESTATION_UID` is assigned in your `.env` basing on your created schema or use the default one

run:

```
pnpm run verify-attestation
```

#### Link to source smart contracts source code

[eas-contracts](https://github.com/ethereum-attestation-service/eas-contracts)

#### Porting process documentation

The strategy we adopted:

We thought to start porting contracts in the following order on local development. Due to heavy local development process we decided to do the porting directly on devnet. We started deploying contracts in this order:

1. **SchemaRegistry**
2. **EAS**
3. **Create Resolver**

Used `AttesterResolver.sol` code :

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import { IEAS, Attestation } from '../../IEAS.sol';
import { SchemaResolver } from '../SchemaResolver.sol';

/// @title AttesterResolver
/// @notice A sample schema resolver that only allows specific attesters.
/// @dev Optimized for Polkadot Asset Hub gas costs.
contract AttesterResolver is SchemaResolver {
  mapping(address attester => bool allowed) private _allowedAttesters;

  error UnauthorizedAttester();

  event AttesterAdded(address indexed attester);
  event AttesterRemoved(address indexed attester);

  /// @dev Creates a new AttesterResolver instance.
  /// @param eas The address of the global EAS contract.
  constructor(IEAS eas) SchemaResolver(eas) {}

  /// @notice Adds an allowed attester.
  /// @param attester The attester to allow.
  function addAttester(address attester) external {
    _allowedAttesters[attester] = true;
    emit AttesterAdded(attester);
  }

  /// @notice Removes an allowed attester.
  /// @param attester The attester to remove.
  function removeAttester(address attester) external {
    _allowedAttesters[attester] = false;
    emit AttesterRemoved(attester);
  }

  /// @notice Checks if an attester is allowed.
  /// @param attester The attester to check.
  /// @return Whether the attester is allowed.
  function isAllowedAttester(address attester) external view returns (bool) {
    return _allowedAttesters[attester];
  }

  /// @inheritdoc SchemaResolver
  function onAttest(Attestation memory attestation, uint256) internal view override returns (bool) {
    return _allowedAttesters[attestation.attester];
  }

  /// @inheritdoc SchemaResolver
  function onRevoke(Attestation memory attestation, uint256) internal view override returns (bool) {
    return _allowedAttesters[attestation.attester];
  }
}
```

Used `SchemaResolver.sol` code:

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import { AccessDenied, InvalidEAS, InvalidLength } from '../Common.sol';
import { IEAS, Attestation } from '../IEAS.sol';
import { Semver } from '../Semver.sol';
import { ISchemaResolver } from './ISchemaResolver.sol';

/// @title SchemaResolver
/// @notice The base schema resolver contract for Polkadot EAS.
/// @dev Enhanced with better gas optimization for Polkadot Asset Hub.
abstract contract SchemaResolver is ISchemaResolver, Semver {
  error InsufficientValue();
  error NotPayable();

  // The global EAS contract.
  IEAS internal immutable _eas;

  /// @dev Creates a new resolver.
  /// @param eas The address of the global EAS contract.
  constructor(IEAS eas) Semver(1, 4, 0) {
    if (address(eas) == address(0)) {
      revert InvalidEAS();
    }

    _eas = eas;
  }

  /// @dev Ensures that only the EAS contract can make this call.
  modifier onlyEAS() {
    _onlyEAS();
    _;
  }

  /// @inheritdoc ISchemaResolver
  function isPayable() external pure virtual returns (bool) {
    return _isPayable();
  }

  /// @dev Internal function to check if the resolver is payable.
  function _isPayable() internal pure virtual returns (bool) {
    return false;
  }

  /// @dev ETH callback.
  receive() external payable virtual {
    if (!_isPayable()) {
      revert NotPayable();
    }
  }

  /// @dev Processes an attestation and verifies whether it's valid.
  /// @param attestation The new attestation.
  /// @return Whether the attestation is valid.
  function onAttest(Attestation memory attestation, uint256 value) internal virtual returns (bool);

  /// @dev Processes an attestation revocation and verifies if it can be revoked.
  /// @param attestation The existing attestation to be revoked.
  /// @return Whether the attestation can be revoked.
  function onRevoke(Attestation memory attestation, uint256 value) internal virtual returns (bool);

  /// @inheritdoc ISchemaResolver
  function attest(bytes calldata attestation) external payable onlyEAS returns (bool) {
    return onAttest(abi.decode(attestation, (Attestation)), msg.value);
  }

  /// @inheritdoc ISchemaResolver
  function multiAttest(
    bytes[] calldata attestations,
    uint256[] calldata values
  ) external payable onlyEAS returns (bool) {
    uint256 length = attestations.length;

    if (length != values.length) {
      revert InvalidLength();
    }

    for (uint256 i = 0; i < length; ) {
      if (!onAttest(abi.decode(attestations[i], (Attestation)), values[i])) {
        return false;
      }

      unchecked {
        ++i;
      }
    }

    return true;
  }

  /// @inheritdoc ISchemaResolver
  function revoke(bytes calldata attestation) external payable onlyEAS returns (bool) {
    return onRevoke(abi.decode(attestation, (Attestation)), msg.value);
  }

  /// @inheritdoc ISchemaResolver
  function multiRevoke(
    bytes[] calldata attestations,
    uint256[] calldata values
  ) external payable onlyEAS returns (bool) {
    uint256 length = attestations.length;

    if (length != values.length) {
      revert InvalidLength();
    }

    for (uint256 i = 0; i < length; ) {
      if (!onRevoke(abi.decode(attestations[i], (Attestation)), values[i])) {
        return false;
      }

      unchecked {
        ++i;
      }
    }

    return true;
  }

  /// @dev Ensures that only the EAS contract can make this call.
  function _onlyEAS() private view {
    if (msg.sender != address(_eas)) {
      revert AccessDenied();
    }
  }
}
```

Used `ISchemaResolver.sol` code:

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { ISemver } from '../ISemver.sol';

/// @title ISchemaResolver
/// @notice The interface of an optional schema resolver.
interface ISchemaResolver is ISemver {
  /// @notice Checks if the resolver can be sent ETH.
  /// @return Whether the resolver supports ETH transfers.
  function isPayable() external pure returns (bool);

  /// @notice Processes an attestation and verifies whether it's valid.
  /// @param attestation The new attestation.
  /// @return Whether the attestation is valid.
  function attest(bytes calldata attestation) external payable returns (bool);

  /// @notice Processes multiple attestations and verifies whether they are valid.
  /// @param attestations The new attestations.
  /// @param values Explicit ETH amounts which were sent with each attestation.
  /// @return Whether all the attestations are valid.
  function multiAttest(bytes[] calldata attestations, uint256[] calldata values) external payable returns (bool);

  /// @notice Processes an attestation revocation and verifies if it can be revoked.
  /// @param attestation The existing attestation to be revoked.
  /// @return Whether the attestation can be revoked.
  function revoke(bytes calldata attestation) external payable returns (bool);

  /// @notice Processes revocation of multiple attestations and verifies they can be revoked.
  /// @param attestations The existing attestations to be revoked.
  /// @param values Explicit ETH amounts which were sent with each revocation.
  /// @return Whether the attestations can be revoked.
  function multiRevoke(bytes[] calldata attestations, uint256[] calldata values) external payable returns (bool);
}
```

Used `deploy.js` code:

```javascript
const { ethers } = require('hardhat');

async function main() {
  console.log('🚀 Starting EAS deployment to Polkadot Asset Hub...');

  // Check if we have a private key
  if (!process.env.PRIVATE_KEY) {
    throw new Error('❌ PRIVATE_KEY not found in environment variables. Please check your .env file.');
  }

  console.log('✅ Private key found in environment');

  const [deployer] = await ethers.getSigners();

  if (!deployer) {
    throw new Error('❌ No signer available. Please check your network configuration and private key.');
  }

  console.log('Deploying contracts with the account:', deployer.address);

  try {
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log('Account balance:', ethers.formatEther(balance), 'ETH');

    if (balance === 0n) {
      console.log('⚠️  Warning: Account balance is 0. You may need testnet tokens to deploy.');
    }
  } catch (error) {
    console.log('⚠️  Could not fetch balance:', error.message);
  }

  // Deploy SchemaRegistry first
  console.log('\n📋 Deploying SchemaRegistry...');
  const SchemaRegistry = await ethers.getContractFactory('SchemaRegistry');
  const schemaRegistry = await SchemaRegistry.deploy();
  await schemaRegistry.waitForDeployment();
  const schemaRegistryAddress = await schemaRegistry.getAddress();

  console.log('✅ SchemaRegistry deployed to:', schemaRegistryAddress);

  // Deploy EAS with SchemaRegistry address
  console.log('\n🔗 Deploying EAS...');
  const EAS = await ethers.getContractFactory('EAS');
  const eas = await EAS.deploy(schemaRegistryAddress);
  await eas.waitForDeployment();
  const easAddress = await eas.getAddress();

  console.log('✅ EAS deployed to:', easAddress);

  // Deploy example AttesterResolver
  console.log('\n👥 Deploying AttesterResolver example...');
  const AttesterResolver = await ethers.getContractFactory('AttesterResolver');
  const attesterResolver = await AttesterResolver.deploy(easAddress);
  await attesterResolver.waitForDeployment();
  const attesterResolverAddress = await attesterResolver.getAddress();

  console.log('✅ AttesterResolver deployed to:', attesterResolverAddress);

  // Verify deployments
  console.log('\n🔍 Verifying deployments...');

  const registryVersion = await schemaRegistry.version();
  console.log('SchemaRegistry version:', registryVersion);

  const easVersion = await eas.version();
  console.log('EAS version:', easVersion);

  const registryFromEAS = await eas.getSchemaRegistry();
  console.log('EAS points to SchemaRegistry:', registryFromEAS);
  console.log('Registry addresses match:', registryFromEAS === schemaRegistryAddress);

  // Create a sample schema for testing
  console.log('\n📝 Creating sample schema...');
  const sampleSchema = 'uint256 score, string name, bool verified';
  const registerTx = await schemaRegistry.register(
    sampleSchema,
    ethers.ZeroAddress, // No resolver
    true // Revocable
  );
  const receipt = await registerTx.wait();

  // Get the schema UID from the event
  const registeredEvent = receipt.logs.find((log) => log.fragment?.name === 'Registered');
  const schemaUID = registeredEvent?.args[0];

  console.log('✅ Sample schema registered with UID:', schemaUID);

  // Summary
  console.log('\n📊 Deployment Summary:');
  console.log('=====================================');
  console.log('Network: Polkadot Asset Hub Testnet');
  console.log('Deployer:', deployer.address);
  console.log('SchemaRegistry:', schemaRegistryAddress);
  console.log('EAS:', easAddress);
  console.log('AttesterResolver:', attesterResolverAddress);
  console.log('Sample Schema UID:', schemaUID);
  console.log('=====================================');

  // Save deployment info
  const deploymentInfo = {
    network: 'asset-hub-testnet',
    chainId: 420420421,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      SchemaRegistry: {
        address: schemaRegistryAddress,
        version: registryVersion
      },
      EAS: {
        address: easAddress,
        version: easVersion
      },
      AttesterResolver: {
        address: attesterResolverAddress
      }
    },
    sampleSchema: {
      uid: schemaUID,
      schema: sampleSchema
    }
  };

  const fs = require('fs');
  const path = require('path');
  const deploymentsDir = path.join(__dirname, '..', 'deployments');

  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(path.join(deploymentsDir, 'asset-hub-testnet.json'), JSON.stringify(deploymentInfo, null, 2));

  console.log('\n💾 Deployment info saved to deployments/asset-hub-testnet.json');
  console.log('\n🎉 Deployment completed successfully!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
```

Then after testing the contracts from the explorer interface, we ran verify commands, we made test scripts and we tried to create attestation. Once we assessed the correct working we decided to fork the official `eas-contract` repository and we readepted the deployment script to follow the original deployment steps, so in order deploying:

1. **SchemaRegistry**
2. **EAS**
3. **Indexer**
4. **EIP712Proxy**

Again we checked from the explorer interface that contract where working, we ran verify commands, and we ran the scripts to create schema and attestation.

## Feedbacks

When we started the migration we where intended to test it locally following [this](https://docs.polkadot.com/develop/smart-contracts/local-development-node/) documentation. We think that the local development is a bit heavy. Project is quite big, building and running development process didn't went smooth unfortunately. Some failure screenshots here:

[Image]()

[Image2]()

We decided to experiment deploying directly onchain.

[Block explorer](https://assethub-polkadot.subscan.io/) shows contracts interface and this is really really nice and helpful during the development phase.
