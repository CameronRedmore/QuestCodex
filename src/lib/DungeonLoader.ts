import localforage from 'localforage';

//Define a Dungeon type
export class Dungeon {
  FileName: string;
  Version: string;
  Thumbnail: string;
  Name: string;
  Description: string;
  Theme: string;
  Color: string;
  Tags: string[];
  ModId: string | null;
  Favorite: boolean;
  Floors: object;

  //Define a constructor
  constructor(
    fileName: string,
    version: string,
    thumbnail: string,
    name: string,
    description: string,
    theme: string,
    color: string,
    tags: string[],
    modId: string | null,
    favorite: boolean,
    floors: object
  ) {
    this.FileName = fileName;
    this.Version = version;
    this.Thumbnail = thumbnail;
    this.Name = name;
    this.Description = description;
    this.Theme = theme;
    this.Color = color;
    this.Tags = tags;
    this.ModId = modId;
    this.Favorite = favorite;
    this.Floors = floors;
  }

  //Define a method to get the total number of floors
  getTotalFloors(): number {
    return Object.keys(this.Floors).length;
  }

  //Thumbnail is base64 encoded, so we need to convert it to a URL
  getThumbnailUrl(): string {
    return `data:image/png;base64,${this.Thumbnail}`;
  }

  async setThumbnail(file: File): Promise<void> {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise((resolve) => {
      reader.onload = () => {
        //Strip off the data URL prefix
        const base64 = reader.result?.toString().split(',')[1];

        if (base64) {
          this.Thumbnail = base64;
        }

        resolve();
      };
    });
  }
};

export class DungeonLoader {
  static async loadFromFile(file: File): Promise<Dungeon> {
    const content = await file.text();

    const dungeon = this.loadFromJson(content, file.name);

    this.saveDungeon(dungeon, false);

    return dungeon;
  }

  static async loadFromLocalForage(id: string): Promise<Dungeon> {
    const content = await localforage.getItem(`dungeon-${id}`) as string;

    if (content === null) {
      throw new Error('Dungeon not found');
    }

    const dungeon = this.loadFromJson(content, `${id}.dungeon`);

    return dungeon;
  }

  static loadFromJson(json: string, fileName: string): Dungeon {
    const dungeon = JSON.parse(json);

    //Create a new Dungeon object
    const newDungeon = new Dungeon(
      fileName,
      dungeon.Version,
      dungeon.Thumbnail,
      dungeon.Name,
      dungeon.Description,
      dungeon.Theme,
      dungeon.Color,
      dungeon.Tags,
      dungeon.ModId,
      dungeon.Favorite,
      dungeon.Floors
    );

    return newDungeon;
  }

  static dungeonToJson(dungeon: Dungeon): string {
    //Remove the filename property
    const { FileName, ...dungeonWithoutFileName } = dungeon;

    console.log(FileName);

    return JSON.stringify(dungeonWithoutFileName, null, 2);
  }

  static async saveDungeon(dungeon: Dungeon, download: boolean): Promise<void> {
    //Remove the filename property
    const dungeonJson = this.dungeonToJson(dungeon);

    await localforage.setItem(`dungeon-${dungeon.FileName.replace('.dungeon', '')}`, dungeonJson);

    if (download) {
      const blob = new Blob([dungeonJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;
      a.download = dungeon.FileName;

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }
}
