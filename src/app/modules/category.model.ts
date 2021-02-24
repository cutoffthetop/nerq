import {QuestionModel} from './question.model';
import {Type} from 'class-transformer';

export class CategoryModel {
  title: string;
  @Type(() => QuestionModel)
  questions: QuestionModel[];

  constructor(title: string) {
    this.title = title;
    this.questions = [
      new QuestionModel(1, 'who is'),
      new QuestionModel(2, 'which has'),
      new QuestionModel(3, 'what about'),
      new QuestionModel(4, 'how many'),
      new QuestionModel(5, 'why not')
    ];
  }
}
