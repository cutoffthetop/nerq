import {QuestionModel} from './question.model';

export class CategoryModel {
  title: string;
  questions: QuestionModel[];

  constructor(title: string) {
    this.title = title;
    this.questions = [
      new QuestionModel(100, 'who is', this),
      new QuestionModel(200, 'why tho', this),
      new QuestionModel(400, 'what about', this),
      new QuestionModel(600, 'how many', this),
      new QuestionModel(1000, 'why not', this)
    ];
  }
}
