const { app, BrowserWindow } = require('electron')
const https = require('https')

let registry = {}

function loadRegistry(cb) {
  https.get(
    'https://raw.githubusercontent.com/USERNAME/guyka-registry/main/sites.json',
    res => {
      let data = ''
      res.on('data', d => data += d)
      res.on('end', () => {
        registry = JSON.parse(data)
        cb()
      })
    }
  )
}

app.whenReady().then(() => {
  loadRegistry(() => {
    const win = new BrowserWindow({
      width: 1200,
      height: 800
    })

    win.loadURL('https://google.com')

    win.webContents.on('will-navigate', (e, url) => {
      if (url.startsWith('guyka://')) {
        e.preventDefault()
        const name = url.replace('guyka://', '')
        if (registry[name]) {
          win.loadURL(registry[name])
        }
      }
    })
  })
})