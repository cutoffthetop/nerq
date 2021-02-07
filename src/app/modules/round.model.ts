import {CategoryModel} from './category.model';

export class RoundModel {
  title: string;
  categories: CategoryModel[];

  constructor(title: string) {
    this.title = title;
    this.categories = [
      new CategoryModel('category 1'),
      new CategoryModel('category 2'),
      new CategoryModel('category 3'),
      new CategoryModel('category 4'),
      new CategoryModel('category 5'),
      new CategoryModel('category 6')
    ];
  }
}
