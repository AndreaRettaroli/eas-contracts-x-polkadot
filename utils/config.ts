import dotenv from "dotenv";

dotenv.config();

export const config = {
  privateKey: process.env.PRIVATE_KEY as string,
  schemaRegistryAddress: process.env.SCHEMA_REGISTRY_ADDRESS as string,
  easAddress: process.env.EAS_ADDRESS as string,
  schemaUid: process.env.SCHEMA_UID as string,
  attestationUid: process.env.ATTESTATION_UID as string,
  network: {
    name: 'Passet Hub',
    rpc: 'https://testnet-passet-hub-eth-rpc.polkadot.io/',
    chainId: 420420422,
    blockExplorer: 'https://blockscout-passet-hub.parity-testnet.parity.io/',
  }
};
