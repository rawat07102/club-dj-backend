import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "@/shared/entities/User.entity"
import { configuration } from "./shared/config"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { IConfiguration } from "./shared/config/configuration.interface"

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
            useFactory: async (
                configService: ConfigService<IConfiguration>
            ) => ({
                type: "postgres",
                url: configService.get("database.url"),
                entities: [User],
                synchronize: true,
                logging: true,
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
