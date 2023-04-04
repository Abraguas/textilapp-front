import { SubCategoryDTO } from "./sub-category-dto";

export class CategoryDTO {
    id: number;
    name: string;
    subCategories: SubCategoryDTO[];
}
