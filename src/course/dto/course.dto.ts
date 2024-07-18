import { IsNotEmpty } from "class-validator";

export class CourseDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    num_credit: number;

    @IsNotEmpty()
    term: number;

    notcal?: number;
}
