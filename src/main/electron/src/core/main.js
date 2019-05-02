const { app, BrowserWindow, dialog} = require('electron')
const { autoUpdater } = require("electron-updater")
const find = require('find-process')

let win
let javaProcessPid

const dispatch = (data) => {
  win.webContents.send('message', data)
}

const createDefaultWindow = () => {

  platform = process.platform;

  // Check operating system
  if (platform === 'win32') {

     serverProcess =  require('child_process').spawn(
       'cmd.exe',
       ['/c', 'demo.bat'],
       {
           cwd: app.getAppPath() + '/demo/bin'//,
           //shell: true
       }
    );

  } else {
     serverProcess = require('child_process')
         .spawn(app.getAppPath() + '/demo/bin/demo');
  }

  if (!serverProcess) {
    console.error('Unable to start server from ' + app.getAppPath());
    app.quit();
    return;
  }

  serverProcess.stdout.on('data', function (data) {
    console.log('Server: ' + data);
  });

  serverProcess.stderr.on('data', function (data) {
    console.log('Error: ' + data);
    console.log('trying to find java process by port...');
    find('port', 8080)
      .then(function (list) {
        if (!list.length) {
          console.log('port 8080 is free now');
        } else {
          console.log('%s is listening port 80', list[0]);
          javaProcessPid = list[0].pid;
          console.log('javaProcessPid' + javaProcessPid);
        }
      }, function (err) {
        console.log(err.stack || err);
      });
  });

  serverProcess.on('close', function (code) {
    console.log('Process exit code: ' + code);
  });

  console.log("Server PID: " + serverProcess.pid);

  win = new BrowserWindow()

  win.on('closed', () => {
    win = null
  });

  win.on('close', function (e) {
      if (serverProcess) {
          e.preventDefault();
          // kill Java executable
          const kill = require('tree-kill');
          kill(javaProcessPid, 'SIGTERM', function () {
              console.log('Server process killed');
              serverProcess = null;
              win.close();
          });
      }
  });

  win.loadFile('src/gui/index.html')

  return win
}

app.on('ready', () => {

  createDefaultWindow()

  autoUpdater.checkForUpdatesAndNotify()

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('version', app.getVersion())
  })

})

app.on('window-all-closed', () => {
  app.quit();
})

autoUpdater.on('checking-for-update', () => {
  dispatch('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
  dispatch('Update available.')
})

autoUpdater.on('update-not-available', (info) => {
  dispatch('Update not available.')
})

autoUpdater.on('error', (err) => {
  dispatch('Error in auto-updater. ' + err)
})

autoUpdater.on('download-progress', (progressObj) => {
  // let log_message = "Download speed: " + progressObj.bytesPerSecond
  // log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  // log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
  // dispatch(log_message)

    win.webContents.send('download-progress', progressObj.percent)

})

autoUpdater.on('update-downloaded', (info) => {
  dispatch('Update downloaded')
})
