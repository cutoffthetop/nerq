import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {QuestionModel} from '../modules/question.model';
import {RoundModel} from '../modules/round.model';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {GameModel} from '../modules/game.model';
import {QuestionState} from '../modules/question.state.enum';
import {from} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from '@angular/material/dialog';
import {SettingsComponent} from '../settings/settings.component';
import {MediaModel} from '../modules/media.model';


@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss']
})
export class HostComponent implements OnInit {

  private game?: GameModel;
  private files: { name: string, url: string, file: File }[] = [];

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private changeDetector: ChangeDetectorRef
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

  getFiles(): { name: string, url: string, file: File }[] {
    return this.files;
  }

  pickDir(): void {
    // @ts-ignore
    const entries = async () => {
      // @ts-ignore
      const dirHandle = await window.showDirectoryPicker();
      const files = [];
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file') {
          const file: File = await entry.getFile();
          files.push({
            name: entry.name,
            url: this.sanitizer.bypassSecurityTrustResourceUrl(
              URL.createObjectURL(file)
            ),
            file
          });
        }
      }
      return files;
    };

    from(entries())
      .subscribe(
        // @ts-ignore
        (files: { name: string, url: string, file: File }[]) => {
          this.files = files;
        }
      );
  }

  openSettings(): void {
    const dialogRef = this.dialog.open(SettingsComponent, {
      data: this.game
    });
    dialogRef.afterClosed().pipe().subscribe(
      (value) => {
        this.game = value;
        // location.reload();
      }
    );
  }

  saveGame(): void {
    this.game = this.getGame().save();
  }

  resetStates(): void {
    if (this.game !== undefined) {
      this.game
        .questionsInOrder()
        .map(
          question => {
            switch (question.state) {
              case QuestionState.questioning:
                question.state = QuestionState.open;
                break;
              case QuestionState.answering:
                question.state = QuestionState.open;
                break;
            }
          }
        );
      this.game.save();
    }
  }

  doneQuestionsCount(): number {
    if (this.game !== undefined) {
      return this.game
        .questionsInOrder()
        .filter(
          question => question.state === QuestionState.done
        )
        .length;
    }
    return 0;
  }

  getCurrentRound(): RoundModel {
    return this.getGame().getCurrentRound();
  }

  getCurrentQuestion(): QuestionModel | undefined {
    return this.getGame().getCurrentQuestion();
  }

  getSoundboard(): MediaModel[] {
    // @ts-ignore
    return this.getGame()
      .questionsInOrder()
      .map(
        question => question.getMedia()
      )
      .filter(
        media => media !== undefined && media.type === 'audio'
      );
  }

  changeRoundTab(event: MatTabChangeEvent): void {
    if (this.game !== undefined) {
      if (this.game.currentRoundIndex !== event.index) {
        this.game.currentRoundIndex = event.index;
      }
    }
  }

  getPointsForQuestion(question: QuestionModel): number {
    const currentRound = this.getCurrentRound();
    if (currentRound !== undefined) {
      const tier = currentRound
        .tiers
        .find(t => t.tier === question.tier);
      if (tier !== undefined) {
        return tier.points;
      }
    }
    return 0;
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
