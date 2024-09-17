import { IConfiguration } from "./configuration.interface"

export const configuration = (): IConfiguration => {
    const { PORT, DB_URL, CLIENT_ORIGIN, JWT_SECRET, BASE_URL } = process.env
    if (!(DB_URL && CLIENT_ORIGIN && JWT_SECRET)) {
        const missingKeys = []
        if (!DB_URL) missingKeys.push("DB_URL")
        if (!CLIENT_ORIGIN) missingKeys.push("CLIENT_ORIGIN")
        if (!JWT_SECRET) missingKeys.push("JWT_SECRET")
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
    }
}
