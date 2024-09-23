/* eslint-disable @typescript-eslint/no-unused-vars */
namespace NodeJS {
    export interface ProcessEnv {
        PORT?: string
        DB_URL?: string
        BASE_URL?: string
        CLIENT_ORIGIN?: string
        JWT_SECRET?: string
        AWS_SECRET_ACCESS_KEY?: string
        AWS_SECRET_KEY_ID?: string
        PROJECT_REGION?: string
        ENDPOINT_URL?: string
        STORAGE_BASE_URL?: string
    }
}
