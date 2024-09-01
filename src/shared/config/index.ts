import { IConfiguration } from "./configuration.interface"

export const configuration = (): IConfiguration => ({
    port: parseInt(process.env.PORT, 10),
    "database.url": process.env.DB_URL,
    clientOrigin: process.env.CLIENT_ORIGIN,
    //youtube: {
    //    apiKey: process.env.YT_API_KEY,
    //    apiUrl: process.env.YT_API_URL,
    //    embed: process.env.YT_EMBED,
    //},
    //secrets: {
    //    jwt: process.env.JWT_SECRET,
    //},
})
