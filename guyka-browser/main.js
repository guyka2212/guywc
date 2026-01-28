const { app, BrowserWindow } = require('electron')
const https = require('https')

let registry = {}

function loadRegistry(cb) {
  https.get(
    'https://raw.githubusercontent.com/guyka2212/guyka-registry/main/sites.json',
    res => {
      let data = ''
      res.on('data', d => data += d)
      res.on('end', () => {
        try {
          registry = JSON.parse(data)
        } catch {
          registry = {}
        }
        cb()
      })
    }
  )
}

app.whenReady().then(() => {
  loadRegistry(() => {
    const win = new BrowserWindow({
      width: 1000,
      height: 700,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    })

    win.loadFile('index.html')

    win.webContents.on('will-navigate', (e, url) => {
      if (url.startsWith('guyka://search/')) {
        e.preventDefault()
        const q = decodeURIComponent(url.split('/').pop())
        if (registry[q]) {
          win.loadURL(registry[q])
        } else {
          win.loadURL('https://www.google.com/search?q=' + encodeURIComponent(q))
        }
      }
    })
  })
})
