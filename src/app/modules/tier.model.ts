export class TierModel {
  points: number;
  tier: number;

  constructor(tier: number) {
    this.tier = tier;
    this.points = 200;
  }
}
