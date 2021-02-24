import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {QuestionModel} from '../modules/question.model';
import {RoundModel} from '../modules/round.model';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {GameModel} from '../modules/game.model';
import {QuestionState} from '../modules/question.state.enum';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss']
})
export class HostComponent implements OnInit {

  private game?: GameModel;

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
  }

  getGame(): GameModel {
    if (this.game === undefined) {
      this.game = GameModel.load();
    }
    return this.game;
  }

  saveGame(): void {
    this.game = this.getGame().save();
  }

  getCurrentRound(): RoundModel {
    return this.getGame().getCurrentRound();
  }

  getCurrentQuestion(): QuestionModel | undefined {
    return this.getGame().getCurrentQuestion();
  }

  changeRoundTab(event: MatTabChangeEvent): void {
    if (this.game !== undefined) {
      if (this.game.currentRoundIndex !== event.index) {
        this.game.currentRoundIndex = event.index;
        this.game.save();
      }
    }
  }

  getWeightForQuestion(question: QuestionModel): number {
    return this.getCurrentRound().tiers.filter(
      tier => tier.tier === question.tier
    )[0].points;
  }

  playQuestion(question: QuestionModel): void {
    if (this.game !== undefined) {
      switch (question.state) {
        case QuestionState.open:
          question.state = QuestionState.questioning;
          break;
        case QuestionState.questioning:
          question.state = QuestionState.answering;
          break;
        case QuestionState.answering:
          question.state = QuestionState.done;
          break;
        case QuestionState.done:
          question.state = QuestionState.open;
          break;
      }
      this.game.save();
    }
  }
}
