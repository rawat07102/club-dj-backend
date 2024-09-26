import { IConfiguration } from "@/shared/config/configuration.interface"
import { Controller, Get, Inject, Param } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import axios from "axios"

@Controller("youtube")
export class YoutubeController {
    constructor(
        @Inject()
        private configService: ConfigService<IConfiguration, true>
    ) {}

    @Get("videos/:videoId")
    async getVideoById(@Param("videoId") videoId: string) {
        const ytRes = await axios.get("/videos", {
            params: {
                id: videoId,
                part: "snippet,statistics",
                fields: "items(id,snippet(title, thumbnails(medium), categoryId, publishedAt),statistics(viewCount))",
                key: this.configService.get("yt.api_key", { infer: true }),
            },
            baseURL: "https://youtube.googleapis.com/youtube/v3",
            headers: {
                "Content-Type": "application/json",
            },
        })
        return ytRes.data
    }
}
