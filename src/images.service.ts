import { Inject, Injectable } from "@nestjs/common"
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { ConfigService } from "@nestjs/config"
import { IConfiguration } from "./shared/config/configuration.interface"
import { Buckets } from "./shared/utils/types"

@Injectable()
export class ImagesService {
    private s3Client: S3Client

    constructor(
        @Inject()
        private readonly configService: ConfigService<IConfiguration, true>
    ) {
        this.s3Client = new S3Client({
            region: configService.get("aws.region", { infer: true }),
            endpoint: configService.get("aws.endpoint_url", { infer: true }),
            credentials: {
                accessKeyId: configService.get("aws.access_key_id", {
                    infer: true,
                }),
                secretAccessKey: configService.get("aws.secret_access_key", {
                    infer: true,
                }),
            },
            forcePathStyle: true

        })
    }

    createImageUrl(fileName: string, bucketName: Buckets) {
        const baseUrl = this.configService.get("sb.storage_base_url", {
            infer: true,
        })
        return `${baseUrl}/${bucketName}/${fileName}`
    }

    async uploadFile(
        file: Express.Multer.File,
        bucketName: Buckets,
        fileName: string,
    ) {
        const uploadCommand = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        })

        await this.s3Client.send(uploadCommand)
        return this.createImageUrl(fileName, bucketName)
    }

    async deleteFile(imageUrl: string) {
        const imageUrlArray = imageUrl.split("/")
        const fileName = imageUrlArray.pop()
        const bucketName = imageUrlArray.pop()
        const deleteCommand = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: fileName
        })
        await this.s3Client.send(deleteCommand)
    }
}
