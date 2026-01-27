function loadRegistry(cb) {
  https.get(
    'https://raw.githubusercontent.com/guyka2212/guyka-registry/main/sites.json',
    res => {
      let data = ''
      res.on('data', d => data += d)
      res.on('end', () => {
        try {
          registry = JSON.parse(data)
          cb()
        } catch (e) {
          console.error('JSON parse error:', e)
          registry = {}
          cb()
        }
      })
    }
  )
}
