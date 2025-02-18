import { CategoryService } from 'src/category/category.service';

export async function returnCategoriesToInsert(
  categoriesIdToInsert: string[],
  categoryService: CategoryService,
) {
  const categories = [];

  for (const categoryId of categoriesIdToInsert) {
    const category = await categoryService.findOne(categoryId);
    categories.push(category);
  }

  return categories;
}
