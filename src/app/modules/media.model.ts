export class MediaModel {
  url: string;
  type: string;
  local: boolean;

  constructor(url: string, type: string, local: boolean) {
    this.url = url;
    this.type = type;
    this.local = local;
  }
}
