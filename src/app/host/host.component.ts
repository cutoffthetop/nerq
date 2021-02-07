import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {QuestionModel} from '../modules/question.model';
import {RoundModel} from '../modules/round.model';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss']
})
export class HostComponent implements OnInit {

  @Input() rounds: RoundModel[];

  constructor(
    private route: ActivatedRoute,
  ) {
    this.rounds = [];
  }

  ngOnInit(): void {
    this.rounds = [
      new RoundModel('main question round'),
      new RoundModel('quick fire round')
    ];
  }

  currentRound(): RoundModel {
    return this.rounds[0];
  }

  maxQuestions(): number {
    return this.currentRound().categories
      .map(category => category.questions.length)
      .reduce((a, b) => Math.max(a, b));
  }

  questions(): QuestionModel[] {
    const categoryIndex = (question: QuestionModel) => this.currentRound().categories.indexOf(question.category);
    return this.currentRound().categories
      .map(category => category.questions)
      .reduce((a, b) => a.concat(b))
      .sort((a, b) => a.weight - b.weight || categoryIndex(a) - categoryIndex(b));
  }
}
