export interface IConfiguration {
    port: number
    database: {
        url: string
    }
    clientOrigin: string
    jwt: {
        secret: string
    }
    baseUrl: string
    //"youtube.apiKey": string
    //"youtube.apiUrl": string
    //"youtube.embed": string
}
