import { IConfiguration } from "@/shared/config/configuration.interface"
import { Inject, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import axios from "axios"

@Injectable()
export class YoutubeService {
    constructor(
        @Inject()
        private configService: ConfigService<IConfiguration, true>
    ) {}
    async getVideoDuration(videoId: string) {
        try {
            const ytRes = await axios.get("/videos", {
                params: {
                    id: videoId,
                    part: "contentDetails",
                    fields: "items(contentDetails(duration))",
                    key: this.configService.get("yt.api_key", { infer: true }),
                },
                baseURL: "https://youtube.googleapis.com/youtube/v3",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            return this.parseYouTubeDuration(
                ytRes.data.items[0].contentDetails.duration
            )
        } catch (err) {
            console.error("Youtube Fetch Error")
            console.error(JSON.stringify(err.response.data.error))
        }
    }
    private parseYouTubeDuration(duration: string): number {
        const durationRegex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
        const match = duration.match(durationRegex)

        if (!match) {
            throw new Error("Invalid YouTube duration format")
        }

        const hours = parseInt(match[1] || "0", 10)
        const minutes = parseInt(match[2] || "0", 10)
        const seconds = parseInt(match[3] || "0", 10)

        const milliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000
        return milliseconds
    }
}
