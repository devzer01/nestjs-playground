import {Type} from "class-transformer";
import {IsOptional, IsPositive} from "class-validator";

export class PaginationQuery {
    @Type(() => Number)
    @IsOptional()
    @IsPositive()
    limit: number;

    @Type(() => Number)
    @IsOptional()
    @IsPositive()
    offset: number;
}