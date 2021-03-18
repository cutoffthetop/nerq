export class MediaModel {
  name: string;
  url: string;
  type: string;
  local: boolean;

  constructor(name: string, url: string, type: string, local: boolean) {
    this.name = name;
    this.url = url;
    this.type = type;
    this.local = local;
  }
}
