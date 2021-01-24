import {Component, Input, OnInit} from '@angular/core';
import {CategoryModel} from './modules/category.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'nerq';
  @Input() categories: CategoryModel[];

  constructor() {
    this.categories = [];
  }

  ngOnInit(): void {
    this.categories = [
      new CategoryModel('category 1'),
      new CategoryModel('category 2'),
      new CategoryModel('category 3'),
      new CategoryModel('category 4'),
      new CategoryModel('category 5')
    ];
  }
}
