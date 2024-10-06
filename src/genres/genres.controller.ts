import { Routes, Services } from '@/shared/constants';
import { Controller, Get, Inject } from '@nestjs/common';
import { IGenresService } from './interfaces/IGenresService.interface';

@Controller(Routes.GENRES)
export class GenresController {
    constructor(
        @Inject(Services.GENRES_SERVICE)
        private readonly genresService: IGenresService,
    ) {}

    @Get()
    getAllGenres() {
        return this.genresService.findAll()
    }
}
