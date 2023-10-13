const express = require('express')

const app = express()
const port = 5000

app.use(express.json())
app.use(require('./Routes/blogs'))
app.use(require('./Routes/search'))

app.listen(port, () => {
  console.log(`Educhamp backend listening at http://localhost:${port}`)
})