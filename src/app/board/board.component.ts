import {Component, Input, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RoundModel} from '../modules/round.model';
import {delay} from 'rxjs/operators';
import {GameModel} from '../modules/game.model';
import {PlayerModel} from '../modules/player.model';
import {fromEvent, Observable} from 'rxjs';
import {MediaModel} from '../modules/media.model';
import {QuestionModel} from '../modules/question.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  // @ts-ignore
  source$: Observable<Event>;
  @Input()
  private game: GameModel;

  constructor(
    private route: ActivatedRoute,
    public zone: NgZone
  ) {
    // @ts-ignore
    this.game = undefined;
  }

  ngOnInit(): void {
    this.source$ = fromEvent(window, 'storage');
    this.source$.pipe(delay(100)).subscribe(
      () => {
        this.zone.run(() => this.game = GameModel.load());
      }
    );
    this.zone.run(() => this.game = GameModel.load());
  }

  getCurrentRoundIndex(): number {
    return this.game.currentRoundIndex;
  }

  getCurrentRound(): RoundModel {
    return this.game.getCurrentRound();
  }

  getCurrentMedia(): MediaModel | undefined {
    return this.game.getCurrentMedia();
  }

  getQuestionOddEven(index: number): string {
    if (Math.floor(index / this.getCurrentRound().categories.length) % 2 === 0) {
      return 'even';
    }
    return 'odd';
  }

  getPlayers(): PlayerModel[] {
    return this.game.players;
  }
}
