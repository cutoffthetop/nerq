import {CategoryModel} from './category.model';

export class QuestionModel {
  title: string;
  weight: number;
  category: CategoryModel;

  constructor(weight: number, title: string, category: CategoryModel) {
    this.title = title;
    this.weight = weight;
    this.category = category;
  }
}
