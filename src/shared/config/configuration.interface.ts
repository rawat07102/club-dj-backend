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
    sb: {
        storage_base_url: string
    }
    aws: {
        access_key_id: string
        secret_access_key: string
        endpoint_url: string
        region: string
    }
    yt: {
        api_key: string
    }
}
