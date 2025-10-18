import { SchemaRegistry, ZERO_ADDRESS } from "@ethereum-attestation-service/eas-sdk";
import { signer } from "../utils/signer";
import { config } from "../utils/config";

const schemaRegistry = new SchemaRegistry(config.schemaRegistryAddress);

const schemaHackathonSubmission = 'string hackathonId,string projectName,string description,address[] team,uint64 submittedDate';
const revocable = true;

async function createSchema() {
    schemaRegistry.connect(signer);
    const transaction = await schemaRegistry.register({
        schema: schemaHackathonSubmission,
        resolverAddress: ZERO_ADDRESS,
        revocable,
    });
    const result = await transaction.wait();
    console.log("Schema created successfully", result);
}

createSchema();