import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"

async function bootstrap() {
    const { PORT, CLIENT_ORIGIN } = process.env
    const app = await NestFactory.create(AppModule)
    app.enableCors({
        origin: CLIENT_ORIGIN,
        credentials: true,
    })
    await app.listen(PORT, () => console.log(`listening on port ${PORT}`))
}
bootstrap()
