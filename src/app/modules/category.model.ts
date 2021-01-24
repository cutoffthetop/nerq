import {QuestionModel} from './question.model';

export class CategoryModel {
  title: string;
  questions: QuestionModel[];

  constructor(title: string) {
    this.title = title;
    this.questions = [
      new QuestionModel(100),
      new QuestionModel(200),
      new QuestionModel(400),
      new QuestionModel(600),
      new QuestionModel(1000)
    ];
  }
}
