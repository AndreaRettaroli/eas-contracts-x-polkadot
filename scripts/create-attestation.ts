import {
    EAS,
    NO_EXPIRATION,
    SchemaEncoder,
    ZERO_ADDRESS,
  } from "@ethereum-attestation-service/eas-sdk";
import { signer } from "../utils/signer";
import { config } from "../utils/config";

const schemaHackathonSubmission = 'string hackathonId,string projectName,string description,address[] team,uint64 submittedDate';

async function createAttestation() {
  const eas = new EAS(config.easAddress);
  eas.connect(signer);
  
  const schemaEncoder = new SchemaEncoder(schemaHackathonSubmission);
  const encodedData = schemaEncoder.encodeData([
    { name: "hackathonId", value: "polkadot-hackathon-2024", type: "string" },
    { name: "projectName", value: "EAS Contracts x Polkadot", type: "string" },
    { name: "description", value: "Ethereum Attestation Service implementation for Polkadot ecosystem", type: "string" },
    { name: "team", value: ["0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165"], type: "address[]" },
    { name: "submittedDate", value: Math.floor(Date.now() / 1000), type: "uint64" },
  ]);
  
  const transaction = await eas.attest({
    schema: config.schemaUid,
    data: {
      recipient: ZERO_ADDRESS,
      expirationTime: NO_EXPIRATION,
      revocable: true,
      data: encodedData,
    },
  });
  
  const newAttestationUID = await transaction.wait();
  
  console.log("Attestation created successfully", newAttestationUID);
}

createAttestation();