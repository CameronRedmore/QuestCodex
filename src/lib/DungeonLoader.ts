import localforage from 'localforage';
import dayjs from 'dayjs';

import { Dialog, Notify } from 'quasar';

export interface Floor {
  Tilemaps: {
    Palette: string[];
    Rooms: Room[]
  }
  Entities: object[];
}

export interface Room {
  Bounds: {
    Position: {
      X: number;
      Y: number;
    };
    Size: {
      X: number;
      Y: number;
    }
  }
  Tilemaps: object[];
}

//Define a Dungeon type
export class Dungeon {
  FileName: string = '';
  Version: string = '';
  Thumbnail: string = '';
  Name: string = '';
  Description: string = '';
  Theme: string = '';
  Color: string = '';
  Tags: string[] = [];
  ModId?: string = '';
  Favorite: boolean = false;
  Floors: object = {};

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
  static directoryHandle: FileSystemDirectoryHandle | null = null;

  static async loadFromFile(file: File): Promise<Dungeon> {
    const content = await file.text();

    const dungeon = this.loadFromJson(content, file.name);

    return dungeon;
  }

  static async loadFromFileSystem(fileName: string): Promise<Dungeon | null> {
    if (!this.directoryHandle) {
      return null;
    }

    const fileHandle = await this.directoryHandle.getFileHandle(fileName);
    const file = await fileHandle.getFile();

    return this.loadFromFile(file);
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
    const newDungeon = new Dungeon();

    //Copy the properties from the JSON object to the new Dungeon object
    Object.assign(newDungeon, dungeon);

    //Loop all floors, rooms and bounds, and set Y to negative
    // for (const floor of Object.values(newDungeon.Floors)) {
    //   for (const room of floor.Tilemaps.Rooms) {
    //     room.Bounds.Position.Y = -room.Bounds.Position.Y;
    //   }
    // }

    //Set the filename
    newDungeon.FileName = fileName;

    return newDungeon;
  }

  static dungeonToJson(dungeon: Dungeon): string {
    //Loop all floors, rooms and bounds, and set Y to negative
    // for (const floor of Object.values(dungeon.Floors)) {
    //   for (const room of floor.Tilemaps.Rooms) {
    //     room.Bounds.Position.Y = -room.Bounds.Position.Y;
    //   }
    // }

    return JSON.stringify(dungeon);
  }

  static async saveDungeon(dungeon: Dungeon): Promise<void> {
    const dungeonJson = this.dungeonToJson(dungeon);

    if (this.directoryHandle === null) {
      const blob = new Blob([dungeonJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;
      a.download = dungeon.FileName || 'dungeon.json';

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    else {
      if (dungeon.FileName === undefined) {
        throw new Error('Dungeon file name is undefined');
      }
      //If the file already exists, back it up
      try {

        Notify.create({
          message: 'Backing up dungeon file. Please wait...',
          color: 'primary',
          position: 'top'
        });

        const existingFileHandle = await this.directoryHandle.getFileHandle(dungeon.FileName);
        const existingFile = await existingFileHandle.getFile();

        const backupFileName = `${dungeon.FileName}.${dayjs().format('YYYY-MM-DDTHH-mm-ss')}.bak`;

        const backupFileHandle = await this.directoryHandle.getFileHandle(backupFileName, { create: true });
        const writable = await backupFileHandle.createWritable();

        const reader = new FileReader();
        reader.readAsText(existingFile);

        await new Promise<void>((resolve) => {
          reader.onload = async () => {
            await writable.write(reader.result as string);
            await writable.close();

            Notify.create({
              message: 'Backup created successfully at "' + backupFileName + '"!',
              color: 'positive',
              position: 'top'
            });

            resolve();
          };
        });
      }
      catch (e) {
        console.log(e);
      }

      Notify.create({
        message: 'Saving dungeon file. Please wait...',
        color: 'primary',
        position: 'top'
      });

      const fileHandle = await this.directoryHandle.getFileHandle(dungeon.FileName, { create: true });
      const writable = await fileHandle.createWritable();

      await writable.write(dungeonJson);
      await writable.close();

      Notify.create({
        message: 'Dungeon saved successfully to "' + dungeon.FileName + '"!',
        color: 'positive',
        position: 'top'
      });
    }
  }

  static async chooseDirectory(): Promise<FileSystemDirectoryHandle> {
    return new Promise((resolve, reject) => {
      Dialog.create({
        title: 'Please Select Your Quest Master Dungeons Folder',
        message: 'Please select the folder where your Quest Master dungeons are stored. Usually C:\\Program Files (x86)\\Steam\\steamapps\\common\\Quest Master\\Dungeons',
      }).onOk(async () => {
        this.directoryHandle = await window.showDirectoryPicker();

        const permission = await this.directoryHandle.requestPermission({ mode: 'readwrite' });

        if (permission === 'granted') {
          resolve(this.directoryHandle);
        }
        else {
          Notify.create({
            type: 'negative',
            message: 'Permission denied to access dungeons directory, unable to load dungeons.',
          });
          reject();
        }

        await localforage.setItem('dungeonDirectoryHandle', this.directoryHandle);

        resolve(this.directoryHandle);
      });
    });
  }

  static async loadAllDungeons(): Promise<string[]> {
    await new Promise(async (resolve, reject) => {
      if (this.directoryHandle === null) {

        //Try to load from localforage
        const dungeonDirectoryHandle = await localforage.getItem('dungeonDirectoryHandle') as FileSystemDirectoryHandle | null;

        if (dungeonDirectoryHandle) {
          this.directoryHandle = dungeonDirectoryHandle;

          let permission = await this.directoryHandle.queryPermission({ mode: 'readwrite' });

          if (permission === 'granted') {
            resolve(this.directoryHandle);
          }
          else {
            permission = await this.directoryHandle.requestPermission({ mode: 'readwrite' });

            Notify.create({
              type: 'negative',
              message: 'Permission denied to access dungeons directory, unable to load dungeons.',
            });
            reject();
          }
        }
        else {
          resolve(await this.chooseDirectory());
        }
      }
      else {
        resolve(this.directoryHandle);
      }
    });

    if (this.directoryHandle === null) {
      Notify.create({
        type: 'negative',
        message: 'Cannot load dungeons directory',
      });

      return [];
    }

    const dungeons: string[] = [];

    for await (const entry of this.directoryHandle.values()) {
      if (entry.kind === 'file' && entry.name.endsWith('.dungeon')) {
        dungeons.push(entry.name);
      }
    }

    return dungeons;
  }
}
