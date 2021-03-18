import {QuestionState} from './question.state.enum';
import {MediaModel} from './media.model';

export class QuestionModel {
  title: string;
  tier: number;
  state: QuestionState;

  constructor(tier: number) {
    this.tier = tier;
    this.title = '';
    this.state = QuestionState.open;
  }

  stateString(): string {
    return this.state.toString();
  }

  stateIcon(): string {
    switch (this.state) {
      case QuestionState.open:
        return 'radio_button_unchecked';
      case QuestionState.questioning:
        return 'play_circle';
      case QuestionState.answering:
        return 'question_answer';
      case QuestionState.done:
        return 'radio_button_checked';
    }
  }

  stateTitle(): string {
    switch (this.state) {
      case QuestionState.open:
        return 'open (click to play)';
      case QuestionState.questioning:
        return 'playing (click for answer)';
      case QuestionState.answering:
        return 'answering (click to close)';
      case QuestionState.done:
        return 'closed (click to re-open)';
    }
  }

  getURLs(): (string | undefined)[] {
    return this.title
      .replace(/\n/g, ' ')
      .split(/[ ,]+/)
      .filter(token => token.startsWith('http') || token.startsWith('/'));
  }

  getURL(): string | undefined {
    const urls = this.getURLs();
    let url;
    if (this.state === QuestionState.questioning) {
      url = urls[0];
    } else if (this.state === QuestionState.answering) {
      url = urls[1];
    }
    return url;
  }
}
