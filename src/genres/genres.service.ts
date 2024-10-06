import { Injectable } from "@nestjs/common"
import { IGenresService } from "./interfaces/IGenresService.interface"
import { InjectRepository } from "@nestjs/typeorm"
import { Genre } from "@/shared/entities"
import { In, Repository } from "typeorm"

@Injectable()
export class GenresService implements IGenresService {
    constructor(
        @InjectRepository(Genre)
        private readonly genresRepo: Repository<Genre>
    ) {}

    findbyIds(ids: Genre["id"][]): Promise<Genre[]> {
        return this.genresRepo.findBy({
            id: In(ids),
        })
    }

    findAll(): Promise<Genre[]> {
        return this.genresRepo.find()
    }
}
