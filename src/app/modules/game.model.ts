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
      new RoundModel('main round'),
      new RoundModel('quick fire')
    ];
    this.players = [
      new PlayerModel('team 1'),
      new PlayerModel('team 2'),
      new PlayerModel('team 3'),
      new PlayerModel('team 4'),
      new PlayerModel('team 5'),
      new PlayerModel('team 6'),
      new PlayerModel('team 7')
    ];
  }

  public static load(): GameModel {
    const gameJSON = localStorage.getItem(GameModel.storageKey);
    if (gameJSON) {
      return deserialize(GameModel, gameJSON);
    } else {
      return (new GameModel()).save();
    }
  }

  public save(): GameModel {
    const gameJSON = serialize(this);
    localStorage.setItem(GameModel.storageKey, gameJSON);
    return this;
  }

  public getCurrentRound(): RoundModel {
    return this.rounds[this.currentRoundIndex];
  }

  getCurrentQuestion(): QuestionModel | undefined {
    return this.rounds[this.currentRoundIndex].questionsInOrder()
      .find(
        question =>
          question.state === QuestionState.questioning || question.state === QuestionState.answering
      );
  }

  getCurrentMedia(): MediaModel | undefined {
    const currentQuestion = this.getCurrentQuestion();
    if (currentQuestion !== undefined) {
      const media = currentQuestion.getMedia();
      if (media !== undefined) {
        if (media.endsWith('mp4')) {
          return new MediaModel(media, 'video');
        }
        return new MediaModel(media, 'image');
      }
    }
    return undefined;
  }
}
