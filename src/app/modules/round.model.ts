import {CategoryModel} from './category.model';
import {TierModel} from './tier.model';
import {QuestionModel} from './question.model';
import {Type} from 'class-transformer';

export class RoundModel {
  title: string;
  @Type(() => CategoryModel)
  categories: CategoryModel[];
  @Type(() => TierModel)
  tiers: TierModel[];

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
    this.tiers = [
      new TierModel(1),
      new TierModel(2),
      new TierModel(3),
      new TierModel(4),
      new TierModel(5)
    ];
  }

  maxQuestions(): number {
    return this.categories
      .map(category => category.questions.length)
      .reduce((a, b) => Math.max(a, b));
  }

  categoryIndex(question: QuestionModel): number {
    return this.categories
      .map(category => category.questions.indexOf(question))
      .find(index => index !== -1) || -1;
  }

  questionsInOrder(): QuestionModel[] {
    return this.categories
      .map(category => category.questions)
      .reduce((a, b) => a.concat(b))
      .sort(
        (a, b) =>
          a.tier - b.tier || this.categoryIndex(a) - this.categoryIndex(b)
      );
  }

  getPointsForTier(tier: number): number {
    return this.tiers
      .filter(t => t.tier === tier)
      .map(t => t.points)
      .pop() || 0;
  }
}
