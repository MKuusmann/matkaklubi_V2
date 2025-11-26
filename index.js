import express from 'express' 
import { indexCntrl, kontaktCntrl, hikeCntrl } from './controllers/viewCntrl.js'

const app = express()

app.use('/', express.static('public'))
app.set("views", "./views");
app.set("view engine", "ejs");

app.get('/', indexCntrl)
app.get('/kontakt', kontaktCntrl)
app.get('/matk/:id', hikeCntrl)

const port = process.env.PORT || 8085

app.listen(port, () => console.log('Rakendus töötab ja kuulab pordil: '+port))