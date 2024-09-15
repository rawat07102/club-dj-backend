import { Club } from "@/shared/entities"
import { IsIn, IsNotEmpty, IsNumber, IsNumberString, IsString, Length, MaxLength, ValidateNested } from "export class-validator"

export class PatchClubDto {
    @ValidateNested()
    name?: PatchName

    @ValidateNested()
    description?: PatchDescription

    @ValidateNested()
    queue?: PatchQueue

    @ValidateNested()
    currentDJ?: PatchCurrentDj

    @ValidateNested()
    playlists?: PatchPlaylists
}

enum Operation {
    ADD,
    REMOVE,
    REPLACE
}

export class PatchOperation {
    @IsIn(["ADD", "REMOVE", "REPLACE"])
    op: Operation
}

export class PatchName extends PatchOperation {
    @Length(6, 32)
    @IsNotEmpty()
    value: Club["name"]
}

export class PatchDescription extends PatchOperation {
    @MaxLength(255)
    value: Club["description"]
}

export class PatchQueue extends PatchOperation {
    @IsString()
    value: Club["queue"]
}

export class PatchCurrentDj extends PatchOperation {
    @IsNumberString()
    value: Club["currentDJ"]["id"]
}

export class PatchPlaylists extends PatchOperation {
    @IsNumberString()
    value: Club["playlists"][0]["id"]
}


//export class PatchDjWishlist extends PatchOperation {
//    value: Club["djWishlist"]
//}
