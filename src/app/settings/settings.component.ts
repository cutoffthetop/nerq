import {Component, Inject} from '@angular/core';
import {GameModel} from '../modules/game.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RoundModel} from '../modules/round.model';
import {PlayerModel} from '../modules/player.model';
import {TierModel} from '../modules/tier.model';
import {CategoryModel} from '../modules/category.model';
import {deserialize} from 'class-transformer';

class DialogComponent {
}

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public game: GameModel,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {
    dialogRef.disableClose = true;
  }

  addTier(round: RoundModel): void {
    const points = 2 * Math.max(
      ...round.tiers
        .map(tier => tier.points),
      50
    );
    round.tiers.push(
      new TierModel(round.tiers.length + 1, points)
    );
    for (const category of round.categories) {
      category.setQuestions(round.tiers.length);
    }
  }

  removeTier(round: RoundModel): void {
    round.tiers.pop();
    for (const category of round.categories) {
      category.setQuestions(round.tiers.length);
    }
  }

  addCategory(round: RoundModel): void {
    round.categories.push(
      new CategoryModel(
        `category ${round.categories.length + 1}`,
        round.tiers.length
      )
    );
  }

  removeCategory(round: RoundModel): void {
    round.categories.pop();
  }

  addRound(): void {
    this.game.rounds.push(
      new RoundModel(`round ${this.game.rounds.length + 1}`)
    );
  }

  removeRound(round: RoundModel): void {
    const index = this.game.rounds.indexOf(round);
    if (index > -1) {
      this.game.rounds.splice(index, 1);
    }
  }

  addPlayer(): void {
    this.game.players.push(
      new PlayerModel(`player ${this.game.players.length + 1}`)
    );
  }

  removePlayer(player: PlayerModel): void {
    const index = this.game.players.indexOf(player);
    if (index > -1) {
      this.game.players.splice(index, 1);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  saveGame(): void {
    this.game.save();
    this.dialogRef.close(this.game);
  }

  download(): void {
    const jsonStr = JSON.stringify(this.game, undefined, 2);
    const out = [];
    for (let i = 0; i < jsonStr.length; i++) {
      out[i] = jsonStr.charCodeAt(i);
    }
    const data = new Uint8Array(out);
    const blob = new Blob([data], {
      type: 'application/octet-stream'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'game.json');
    const event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent(event);
  }

  upload(event: Event): void {
    let file = null;
    try {
      // @ts-ignore
      file = event.target.files[0];
    } catch {
      return;
    }
    const reader = new FileReader();
    reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
      if (readerEvent.target !== null && typeof readerEvent.target.result === 'string') {
        this.game = deserialize(GameModel, readerEvent.target.result);
        this.game.save();
        this.dialogRef.close(this.game);
      }
    };
    reader.readAsText(file);
  }
}
