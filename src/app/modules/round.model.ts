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
    this.tiers = [
      new TierModel(1, 100),
      new TierModel(2, 200),
      new TierModel(3, 400),
      new TierModel(4, 600),
      new TierModel(5, 1000)
    ];
    this.categories = [
      new CategoryModel('category 1', this.tiers.length),
      new CategoryModel('category 2', this.tiers.length),
      new CategoryModel('category 3', this.tiers.length),
      new CategoryModel('category 4', this.tiers.length),
      new CategoryModel('category 5', this.tiers.length),
      new CategoryModel('category 6', this.tiers.length)
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
