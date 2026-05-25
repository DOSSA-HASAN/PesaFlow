import fs from "fs";
import crypto from "crypto";
import redisClient from "../../utils/redisClient.js";
import * as path from "node:path";

export const generateSecurityCredential = async () => {
    const cert = fs.readFileSync(
        path.resolve("./certificates/SandboxCertificate.cer"),
        "utf8"
    )

    const password = process.env.MPESA_INITIATOR_PASSWORD;
    const cachedSecurityCredential = await redisClient.get(`mpesa:security_credential:${password}`)
    if (cachedSecurityCredential) {
        return cachedSecurityCredential
    }

    if (!password) {
        throw new Error("Missing MPESA_INITIATOR_PASSWORD");
    }

    const encrypted = crypto.publicEncrypt(
        {
            key: cert,
            padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(password, "utf8")
    );

    const encryptedCredential = encrypted.toString("base64");
    await redisClient.set(`mpesa:security_credential:${password}`, encryptedCredential, {EX: 60 * 60})
    return encryptedCredential
}