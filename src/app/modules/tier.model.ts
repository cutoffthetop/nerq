export class TierModel {
  points: number;
  tier: number;

  constructor(tier: number, points: number) {
    this.tier = tier;
    this.points = points;
  }
}
