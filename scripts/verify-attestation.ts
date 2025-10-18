import { EAS, NO_EXPIRATION } from "@ethereum-attestation-service/eas-sdk";
import { provider } from "../utils/provider";
import { config } from "../utils/config";

async function verifyAttestation() {
const eas = new EAS(config.easAddress);
eas.connect(provider);

const uid = config.attestationUid;

    const attestation = await eas.getAttestation(uid);

    console.log("Attestation verified successfully", attestation);
}

verifyAttestation();