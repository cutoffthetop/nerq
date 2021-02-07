import {Component, Input, OnInit} from '@angular/core';
import {CategoryModel} from '../modules/category.model';
import {QuestionModel} from '../modules/question.model';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @Input() categories: CategoryModel[];

  constructor(
    private route: ActivatedRoute,
  ) {
    this.categories = [];
  }

  ngOnInit(): void {
    this.categories = [
      new CategoryModel('who is james dean?'),
      new CategoryModel('category 2'),
      new CategoryModel('category 3'),
      new CategoryModel('category 4'),
      new CategoryModel('category 5'),
      new CategoryModel('category 6')
    ];
  }

  maxQuestions(): number {
    return this.categories
      .map(category => category.questions.length)
      .reduce((a, b) => Math.max(a, b));
  }

  questions(): QuestionModel[] {
    const categoryIndex = (question: QuestionModel) => this.categories.indexOf(question.category);
    return this.categories
      .map(category => category.questions)
      .reduce((a, b) => a.concat(b))
      .sort((a, b) => a.weight - b.weight || categoryIndex(a) - categoryIndex(b));
  }
}
