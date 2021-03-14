export class PlayerModel {
  name: string;
  points: number;
  assetUrl?: string;

  constructor(name: string) {
    this.name = name;
    this.points = 0;
  }
}
