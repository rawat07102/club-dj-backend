import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ConfigService } from "@nestjs/config"
import { IConfiguration } from "./shared/config/configuration.interface"
import { ValidationPipe } from "@nestjs/common"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const configService = app.get(ConfigService<IConfiguration, true>)
    const PORT = configService.get("port")
    app.useGlobalPipes(new ValidationPipe())
    app.enableCors({
        origin: configService.get("clientOrigin"),
        credentials: true,
    })
    await app.listen(PORT, () => console.log(`listening on port ${PORT}`))
}
bootstrap()
