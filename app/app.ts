import * as tar from 'tar';
import fs from 'fs';
import path from 'path';
import moment from 'moment';

import * as config from './config.json';
import { Config } from './config';

const DATE_FORMAT = "MMDDYYYYHHmmss";

class BackupMinecraft {
  date = moment();
  config: Config = Object.assign(config);

  constructor() {
    this.init();
  }

  init(): void {
    this.backupMinecraftServer();
    // this.findOutdatedBackups();
  }

  backupMinecraftServer(): void{
    tar.c(
      {
        gzip: true,
        file: `./mc-${this.date.format(DATE_FORMAT)}.tgz`
      },
      [this.config.minecraftInstallPath]
    ).then(() => {
      const outdatedBackups: Array<string> = this.findOutdatedBackups();
      this.removeOutdatedBackups(outdatedBackups);
    });
  }

  findOutdatedBackups(): Array<string> {
    const startPath = './';
    const filter = '.tgz';
    const matchDate = /([0-9])\w+/;
    const matchedFiles: Array<string> = [];
    if (!fs.existsSync(startPath)) {
      console.log("No directories ", startPath);
      return [];
    }

    const files = fs.readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
      const filename = path.join(startPath, files[i]);
      if (filename.indexOf(filter) >= 0) {
        const match = matchDate.exec(filename);
        const units = this.convertToDuration(this.config.backupFrequency);
        if (!match) {
          continue;
        }

        const fileDate = moment(match[0], DATE_FORMAT);
        const timeIsGreaterThanAllowed = fileDate.isBefore(this.date.subtract(this.config.limitTimeGoingBack, units));

        if (timeIsGreaterThanAllowed) {
          matchedFiles.push(`./${filename}`);
        }
      };
    };
    return matchedFiles;

  }

  removeOutdatedBackups(outdatedBackups: Array<string>): void {
    outdatedBackups.forEach(backup => {
      fs.unlink(backup, error => {
        if (error) {
          console.log(`Failed to remove ${backup}`);
        }
      })
    });
  }

  convertToDuration(unit: string): moment.unitOfTime.DurationConstructor {
    switch (unit) {
      case 'seconds':
      case 'second':
      case 'minutes':
      case 'minute':
      case 'days':
      case 'day':
      case 'weeks':
      case 'week':
      case 'months':
      case 'month':
        return unit;
      default:
        return 'hours';
    }
  }

}

new BackupMinecraft();
