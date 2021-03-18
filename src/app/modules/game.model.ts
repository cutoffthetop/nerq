import {RoundModel} from './round.model';
import {PlayerModel} from './player.model';
import {deserialize, serialize, Type} from 'class-transformer';
import {QuestionState} from './question.state.enum';
import {MediaModel} from './media.model';
import {QuestionModel} from './question.model';

export class GameModel {
  static storageKey = 'GAME';
  currentRoundIndex: number;
  @Type(() => RoundModel)
  rounds: RoundModel[];
  @Type(() => PlayerModel)
  players: PlayerModel[];

  public constructor(index: number = 0, rounds?: RoundModel[]) {
    this.currentRoundIndex = index;
    this.rounds = rounds || [
      new RoundModel('round 1')
    ];
    this.players = [];
    for (let player = 0; player < this.players.length; player++) {
      this.players.push(
        new PlayerModel(`player ${this.players.length + 1}`)
      );
    }
  }

  public static load(): GameModel {
    const rawJSON = localStorage.getItem(GameModel.storageKey);
    if (rawJSON) {
      return deserialize(GameModel, rawJSON);
    } else {
      return (new GameModel()).save();
    }
  }

  public save(): GameModel {
    const rawJSON = serialize(this);
    localStorage.setItem(GameModel.storageKey, rawJSON);
    return this;
  }

  public getCurrentRound(): RoundModel {
    return this.rounds[this.currentRoundIndex];
  }

  public questionsInOrder(): QuestionModel[] {
    const currentRound = this.getCurrentRound();
    if (currentRound !== undefined) {
      return currentRound.questionsInOrder();
    }
    return [];
  }

  getCurrentQuestion(): QuestionModel | undefined {
    return this.questionsInOrder()
      .find(
        question =>
          question.state === QuestionState.questioning || question.state === QuestionState.answering
      );
  }
}
