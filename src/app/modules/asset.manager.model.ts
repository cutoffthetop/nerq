import {deserialize, serialize, Type} from 'class-transformer';
import {MediaModel} from './media.model';

export class AssetManagerModel {
  static storageKey = 'ASSETS';
  @Type(() => MediaModel)
  medias: MediaModel[];

  public constructor(medias: MediaModel[]) {
    this.medias = medias;
  }

  public static load(): AssetManagerModel {
    const rawJSON = localStorage.getItem(AssetManagerModel.storageKey);
    if (rawJSON) {
      return deserialize(AssetManagerModel, rawJSON);
    } else {
      return (new AssetManagerModel([])).save();
    }
  }

  public save(): AssetManagerModel {
    const rawJSON = serialize(this);
    localStorage.setItem(AssetManagerModel.storageKey, rawJSON);
    return this;
  }

  public hasMedia(): boolean {
    return this.medias.length > 0;
  }

  public resolveURL(url: string | undefined): MediaModel | undefined {
    if (url === undefined) {
      return undefined;
    }
    const name = url.split('/').pop() || '';
    let local = false;
    if (!url.startsWith('http')) {
      local = true;
    }
    let type = 'image';

    if (url.endsWith('mp4')) {
      type = 'video';
    } else if (url.endsWith('mp3')) {
      type = 'audio';
    }
    if (!local) {
      return new MediaModel(name, url, type, local);
    }
    return this.medias
      .filter(
        media => media.name === name
      )
      .pop();
  }
}
