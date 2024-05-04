import { Type } from "class-transformer";
import { 
    IsNumber, 
    IsOptional, 
    IsPositive, 
    Min 
} from "class-validator";

/* The PaginationDTO class in TypeScript defines optional properties for limit and offset with
validation decorators. */
export class PaginationDTO{
/* The code snippet you provided is defining a TypeScript class named `PaginationDTO` with two optional
properties: `limit` and `offset`. Let's break down what each validation decorator is doing for the
`limit` property: */
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number

/* The code snippet you provided is defining validation rules for the `offset` property in the
`PaginationDTO` class. Here's what each validation decorator is doing: */
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    @IsNumber()
    offset?: number
}