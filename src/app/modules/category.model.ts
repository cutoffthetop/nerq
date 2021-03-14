import {QuestionModel} from './question.model';
import {Type} from 'class-transformer';

export class CategoryModel {
  title: string;
  @Type(() => QuestionModel)
  questions: QuestionModel[];

  constructor(title: string, tiers: number) {
    this.title = title;
    this.questions = [];
    this.setQuestions(tiers);
  }

  setQuestions(tiers: number): void {
    if (this.questions.length > tiers) {
      this.questions = this.questions.slice(0, tiers);

    } else if (this.questions.length < tiers) {
      const questionsToAdd = tiers - this.questions.length;
      for (let tier = 0; tier < questionsToAdd; tier++) {
        this.questions.push(
          new QuestionModel(this.questions.length + 1)
        );
      }
    }
  }
}
