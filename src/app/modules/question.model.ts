import {QuestionState} from './question.state.enum';

export class QuestionModel {
  title: string;
  tier: number;
  state: QuestionState;

  constructor(tier: number, title: string, state?: QuestionState) {
    this.title = title;
    this.tier = tier;
    this.state = state || QuestionState.open;
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

  getMedia(): string | undefined {
    const urls = this.title
      .split(/[ ,]+/)
      .filter(token => token.startsWith('http') || token.startsWith('/'));
    urls.push(
      '/assets/spinner.gif',
      '/assets/spinner.gif'
    );
    if (this.state === QuestionState.questioning) {
      return urls[0];
    } else if (this.state === QuestionState.answering) {
      return urls[1];
    }
    return undefined;
  }
}
