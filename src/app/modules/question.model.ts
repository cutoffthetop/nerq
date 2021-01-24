export class QuestionModel {
  title: string;
  weight: number;

  constructor(weight: number) {
    this.title = weight.toString();
    this.weight = weight;
  }
}
