import { User } from "@/shared/entities"

export interface IUserService {
    create(args: createUserDetails): Promise<User["id"]>
    findAll(args: findAllOptions): Promise<User[]>
    findByUsername(username: User["username"]): Promise<User>
    findById(id: User["id"]): Promise<User>
    delete(id: User["id"]): Promise<boolean>
}

export type createUserDetails = {
    username: User["username"]
    password: User["password"]
    email: User["email"]
}

export type findAllOptions = {
    start?: number
    count?: number
}
