import { IConfiguration } from "./configuration.interface"

export const configuration = (): IConfiguration => {
    const {
        PORT,
        DB_URL,
        CLIENT_ORIGIN,
        JWT_SECRET,
        BASE_URL,
        AWS_SECRET_KEY_ID,
        AWS_SECRET_ACCESS_KEY,
        STORAGE_BASE_URL,
        PROJECT_REGION,
        ENDPOINT_URL,
    } = process.env
    const missingKeys = []
    if (!DB_URL) missingKeys.push("DB_URL")
    if (!CLIENT_ORIGIN) missingKeys.push("CLIENT_ORIGIN")
    if (!JWT_SECRET) missingKeys.push("JWT_SECRET")
    if (!AWS_SECRET_KEY_ID) missingKeys.push("AWS_SECRET_KEY_ID")
    if (!AWS_SECRET_ACCESS_KEY) missingKeys.push("AWS_SECRET_ACCESS_KEY")
    if (!STORAGE_BASE_URL) missingKeys.push("STORAGE_BASE_URL")
    if (!PROJECT_REGION) missingKeys.push("PROJECT_REGION")
    if (!ENDPOINT_URL) missingKeys.push("ENDPOINT_URL")

    if (missingKeys.length > 0) {
        let message = missingKeys.join("\n")
        message = "Env variables are missing: \n" + " - " + message
        throw new Error(message)
    }

    return {
        port: parseInt(PORT || "4000", 10),
        database: { url: DB_URL },
        clientOrigin: CLIENT_ORIGIN,
        jwt: { secret: JWT_SECRET },
        baseUrl: BASE_URL,
        sb: { storage_base_url: STORAGE_BASE_URL },
        aws: {
            access_key_id: AWS_SECRET_KEY_ID,
            secret_access_key: AWS_SECRET_ACCESS_KEY,
            endpoint_url: ENDPOINT_URL,
            region: PROJECT_REGION,
        },
    }
}
