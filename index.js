import express from 'express' 
import { indexCntrl, kontaktCntrl, hikeCntrl, regCntrl } from './controllers/viewCntrl.js'
import { 
    apiAllHikesCntrl,
    apiAddHikeCntrl,
    apiGetHikeCntrl,
    apiDeleteHikeCntrl,
    apiPatchHikeCntrl,
    apiHealthCntrl,
    apiOneHikeDetailsCntrl,
    apiPostParticipantCntrl
} from './controllers/apiCntrl.js'
import { adminCntrl } from './controllers/adminViewCntrl.js'
import { initModel } from './model/matkad.js'

const app = express()

app.use('/', express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set("views", "./views");
app.set("view engine", "ejs");

app.get('/', indexCntrl)
app.get('/kontakt', kontaktCntrl)
app.get('/matk/:id', hikeCntrl)
app.get('/matk/:id/regristreerumine', regCntrl)
app.get('/admin', adminCntrl)

app.get('/api/health', apiHealthCntrl)
app.get('/api/matk', apiAllHikesCntrl)
//app.get('/api/matk/:id', apiGetHikeCntrl)
app.post('/api/matk', apiAddHikeCntrl)
app.delete('/api/matk/:id', apiDeleteHikeCntrl)
app.patch('/api/matk/:id', apiPatchHikeCntrl)
app.get('/api/matk/:id', apiOneHikeDetailsCntrl)
app.post('/api/matk/:id/osaleja', apiPostParticipantCntrl)

const port = process.env.PORT || 8085

app.listen(port, () => {
    console.log('Rakendus töötab ja kuulab pordil: '+port)
    initModel()
})