import { Genre } from "@/shared/entities";

export interface IGenresService {
    findbyIds(ids: Genre["id"][]): Promise<Genre[]>
    findAll(): Promise<Genre[]>
}
