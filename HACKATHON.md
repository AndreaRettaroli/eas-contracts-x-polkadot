# Contract Verification Commands for Asset Hub Testnet

## Verify SchemaRegistry Contract
```bash
npx hardhat verify --network asset-hub-testnet 0x3cbd4DD4617e2aF95c5b451b1c9a3ab16E23b4a1
```

## Verify EAS Contract
```bash
npx hardhat verify --network asset-hub-testnet 0x66e45E407B1159F126e76aeF9DbFf426952b2e15 0x3cbd4DD4617e2aF95c5b451b1c9a3ab16E23b4a1
```

## Verify EIP712Proxy Contract
```bash
npx hardhat verify --network asset-hub-testnet 0x592FCDB8439E5D11AC5117472E89f63289b47899 0x3cbd4DD4617e2aF95c5b451b1c9a3ab16E23b4a1 "2CEIP712Proxy"
```

## Verify Indexer Contract
```bash
npx hardhat verify --network asset-hub-testnet 0xd64b14E3bC71439eD2106e0Af2a610aac0357383 0x3cbd4DD4617e2aF95c5b451b1c9a3ab16E23b4a1
```
