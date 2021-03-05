import {QuestionModel} from './question.model';
import {Type} from 'class-transformer';

export class CategoryModel {
  title: string;
  @Type(() => QuestionModel)
  questions: QuestionModel[];

  constructor(title: string) {
    this.title = title;
    this.questions = [
      new QuestionModel(1),
      new QuestionModel(2),
      new QuestionModel(3),
      new QuestionModel(4),
      new QuestionModel(5)
    ];
  }
}
