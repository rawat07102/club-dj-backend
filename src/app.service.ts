import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "./shared/entities/User.entity"
import { Repository } from "typeorm"

@Injectable()
export class AppService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>
    ) {}
    getHello(): string {
        return "Hello World!"
    }

    getDatabase(): any {
        return this.userRepo.find({});
    }
}
