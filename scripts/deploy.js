const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Starting EAS deployment to Polkadot Asset Hub...");
    
    // Check if we have a private key
    if (!process.env.PRIVATE_KEY) {
        throw new Error("❌ PRIVATE_KEY not found in environment variables. Please check your .env file.");
    }
    
    console.log("✅ Private key found in environment");
    
    const [deployer] = await ethers.getSigners();
    
    if (!deployer) {
        throw new Error("❌ No signer available. Please check your network configuration and private key.");
    }
    
    console.log("Deploying contracts with the account:", deployer.address);
    
    try {
        const balance = await deployer.provider.getBalance(deployer.address);
        console.log("Account balance:", ethers.formatEther(balance), "ETH");
        
        if (balance === 0n) {
            console.log("⚠️  Warning: Account balance is 0. You may need testnet tokens to deploy.");
        }
    } catch (error) {
        console.log("⚠️  Could not fetch balance:", error.message);
    }

    // Deploy SchemaRegistry first
    console.log("\n📋 Deploying SchemaRegistry...");
    const SchemaRegistry = await ethers.getContractFactory("SchemaRegistry");
    const schemaRegistry = await SchemaRegistry.deploy();
    await schemaRegistry.waitForDeployment();
    const schemaRegistryAddress = await schemaRegistry.getAddress();
    
    console.log("✅ SchemaRegistry deployed to:", schemaRegistryAddress);

    // Deploy EAS with SchemaRegistry address
    console.log("\n🔗 Deploying EAS...");
    const EAS = await ethers.getContractFactory("EAS");
    const eas = await EAS.deploy(schemaRegistryAddress);
    await eas.waitForDeployment();
    const easAddress = await eas.getAddress();
    
    console.log("✅ EAS deployed to:", easAddress);

    // Deploy EIP712Proxy
    console.log("\n📝 Deploying EIP712Proxy...");
    const EIP712Proxy = await ethers.getContractFactory("EIP712Proxy");
    const eip712Proxy = await EIP712Proxy.deploy(easAddress, "EIP712Proxy");
    await eip712Proxy.waitForDeployment();
    const eip712ProxyAddress = await eip712Proxy.getAddress();
    
    console.log("✅ EIP712Proxy deployed to:", eip712ProxyAddress);

    // Deploy Indexer
    console.log("\n🔍 Deploying Indexer...");
    const Indexer = await ethers.getContractFactory("Indexer");
    const indexer = await Indexer.deploy(easAddress);
    await indexer.waitForDeployment();
    const indexerAddress = await indexer.getAddress();
    
    console.log("✅ Indexer deployed to:", indexerAddress);

    // Verify deployments
    console.log("\n🔍 Verifying deployments...");
    
    const registryVersion = await schemaRegistry.version();
    console.log("SchemaRegistry version:", registryVersion);
    
    const easVersion = await eas.version();
    console.log("EAS version:", easVersion);
    
    const registryFromEAS = await eas.getSchemaRegistry();
    console.log("EAS points to SchemaRegistry:", registryFromEAS);
    console.log("Registry addresses match:", registryFromEAS === schemaRegistryAddress);

    
    // Summary
    console.log("\n📊 Deployment Summary:");
    console.log("=====================================");
    console.log("Network: Polkadot Asset Hub Testnet");
    console.log("Deployer:", deployer.address);
    console.log("SchemaRegistry:", schemaRegistryAddress);
    console.log("EAS:", easAddress);
    console.log("EIP712Proxy:", eip712ProxyAddress);
    console.log("Indexer:", indexerAddress);
    console.log("=====================================");

    // Save deployment info
    const deploymentInfo = {
        network: "asset-hub-testnet",
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
            EIP712Proxy: {
                address: eip712ProxyAddress
            },
            Indexer: {
                address: indexerAddress
            }
        }
    };

    const fs = require('fs');
    const path = require('path');
    const deploymentsDir = path.join(__dirname, '..', 'deployments');
    
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }
    
    fs.writeFileSync(
        path.join(deploymentsDir, 'asset-hub-testnet.json'),
        JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log("\n💾 Deployment info saved to deployments/asset-hub-testnet.json");
    console.log("\n🎉 Deployment completed successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });