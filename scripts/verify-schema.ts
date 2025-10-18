import { SchemaRegistry } from '@ethereum-attestation-service/eas-sdk';
import { provider } from '../utils/provider';
import { config } from '../utils/config';


async function verifySchema() {
  const schemaRegistry = new SchemaRegistry(config.schemaRegistryAddress);
  const schemaUid = config.schemaUid;
  schemaRegistry.connect(provider);
  const schema = await schemaRegistry.getSchema({ uid: schemaUid });
  console.log('Schema verified successfully', schema);
}

verifySchema();
