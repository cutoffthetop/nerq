import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {QuestionModel} from '../modules/question.model';
import {RoundModel} from '../modules/round.model';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {GameModel} from '../modules/game.model';
import {QuestionState} from '../modules/question.state.enum';
import {from} from 'rxjs';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {MatDialog} from '@angular/material/dialog';
import {SettingsComponent} from '../settings/settings.component';
import {MediaModel} from '../modules/media.model';
import {AssetManagerModel} from '../modules/asset.manager.model';


@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss']
})
export class HostComponent implements OnInit {

  private game?: GameModel;
  private assetManager?: AssetManagerModel;
  private focusedQuestion?: QuestionModel;

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

  getAssetManager(): AssetManagerModel {
    if (this.assetManager === undefined) {
      this.assetManager = (new AssetManagerModel([])).save();
    }
    return this.assetManager;
  }

  sanitize(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  hasFiles(): boolean {
    return this.getAssetManager().hasMedia();
  }

  pickFiles(): void {
    // @ts-ignore
    const entries = async () => {
      // @ts-ignore
      const dirHandle = await window.showDirectoryPicker();
      const medias: MediaModel[] = [];
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file') {
          const file: File = await entry.getFile();
          let type = 'image';
          if (file.type === 'video/mp4') {
            type = 'video';
          } else if (file.type.startsWith('audio')) {
            type = 'audio';
          } else if (!file.type.startsWith('image')) {
            continue;
          }
          const url = URL.createObjectURL(file);
          medias.push(
            new MediaModel(entry.name, url, type, true)
          );
        }
      }
      return medias;
    };

    from(entries())
      .subscribe(
        // @ts-ignore
        (medias: MediaModel[]) => {
          this.assetManager = (new AssetManagerModel(medias)).save();
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
    return this.focusedQuestion || this.getGame().getCurrentQuestion();
  }

  getSoundboard(): MediaModel[] {
    // @ts-ignore
    const remoteAudio = this.getGame()
      .questionsInOrder()
      .map(
        question => this.getAssetManager().resolveURL(question.getURL())
      )
      .filter(
        media => media !== undefined && !media.local && media.type === 'audio'
      );
    const localAudio = this.getAssetManager().medias
      .filter(
        media => media !== undefined && media.local && media.type === 'audio'
      );

    // @ts-ignore
    return remoteAudio.concat(localAudio);
  }

  changeRoundTab(event: MatTabChangeEvent): void {
    if (this.game !== undefined) {
      if (this.game.currentRoundIndex !== event.index - 1) {
        this.game.currentRoundIndex = event.index - 1;
        this.game.save();
      }
    }
  }

  focusQuestion(question: QuestionModel): void {
    this.focusedQuestion = question;
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
      this.focusedQuestion = question;
      this.game.save();
    }
  }
}
