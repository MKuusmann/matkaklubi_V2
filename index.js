import express from 'express' 
import session from 'express-session'
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
import { adminCntrl, requireAuth, loginCntrl, loginPostCntrl, logoutCntrl } from './controllers/adminViewCntrl.js'
import { initModel } from './model/matkadMongoDb.js'

const app = express()

app.use('/', express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}))

app.set("views", "./views");
app.set("view engine", "ejs");

app.get('/', indexCntrl)
app.get('/kontakt', kontaktCntrl)
app.get('/matk/:id', hikeCntrl)
app.get('/matk/:id/regristreerumine', regCntrl)

// Login routes (before protected admin route)
app.get('/admin/login', loginCntrl)
app.post('/admin/login', loginPostCntrl)

// Protected admin route
app.get('/admin', requireAuth, adminCntrl)

// Logout route
app.post('/admin/logout', requireAuth, logoutCntrl)

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