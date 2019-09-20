# Minecraft Server Backup

This nodejs program is meant to run periodically based on your settings and will backup your minecraft server. You can set it to take a snapshot every minute, hour, day, etc.

## Prerequisites
  - nodejs needs to be installed on your machine
  - you need access to the terminal. (windows use wsl)
  - you need to be able to edit your crontab to setup a cron job.

## Running the application

### Step 1: Stand up the environment.
  - Pull down this project and cd into the root of the project.
  - Run the command `npm install`
  - Run the command `chmod a+x ./backup-mc-server.sh`
  - Open up the config.json file located in the app/ folder, and you will need to set these 4 properties.
    - Set the `minecraftInstallPath` to the full path of your Minecraft-server installation.
      - i.e., "/mnt/c/Users/eaglejs/Downloads/minecraft-server" // WSL path roughly
      - i.e., "/Users/eaglejs/Downloads/minecraft-server // Mac path roughly
    - set the `backupFrequency` to ('seconds' or 'minutes' or 'hours' or 'days' or 'weeks' or 'months'). Do you want this script to execute every second? every hour? every day?
    - Set the `limitTimeGoingBack`. This is expecting a whole number. like 1, 2, 3, 4, 5, etc. This number when set in tandem with `backupFrequency` will give you the ammount of backups you will have as far back as you want to go. For example, if you said: "I want to make a backup every hour as far back as 10 hours." you would set `limitTimeGoingBack: 10` and `backupFrequency: 'hours'`. If you said: "I want to make a backup every minute as far back as 30 minutes." You would set `limitTimeGoingBack: 30` and `backupFrequency: 'minutes'`

### Step 2: Declare a cron job
  - In the terminal type: `crontab -e`.
  - This will open up your favorite text editor "usually it is vim"
  - move your cursor down to the end of the file and type `i` in order to put the file in edit mode.
  - This part is where it get's a little hairy. You need to know how often you want to run the backups in correlation with your config file. So I am going to assume you know a little bit about crontab, and I'll leave an example that is just like the examples I game in step 1.
  - To set the cronjob to run every minute type the following:
    - * * * * * cd /Users/eaglejs/test-minecraft-server/ && /bin/bash backup-mc-server.sh
  - To set the cronjob to run every hour type the following:
    - 0 * * * * cd /Users/eaglejs/test-minecraft-server/ && /bin/bash backup-mc-server.sh
  - To set the cronjob to run daily type the following:
    - 0 0 * * * cd /Users/eaglejs/test-minecraft-server/ && /bin/bash backup-mc-server.sh
  - After you are done editing hit the `escape` key and type: `:wq` and then the `enter` key

Presto, you should be making backups now.