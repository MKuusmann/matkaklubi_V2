import { addOsaleja, getMatkadModel, getMatkModel } from '../model/matkad.js'


export function indexCntrl(req, res) {
    const matkadArray = getMatkadModel()
    res.render('index', {matkad: matkadArray})
}
export function kontaktCntrl(req, res) {
    res.render('kontakt')
}
export function hikeCntrl(req, res) {
    const hikeId = req.params.id
    const hike = getMatkModel(hikeId)
    console.log(hike)
    res.render('matk', {matk: hike, error: "", success: ""})
}

export function regCntrl(req, res) {
    const hikeId = req.params.id
    const email = req.query.email
    const nimi = req.query.nimi
    if(!hikeId) {
        res.send('Matka ID puudub!')
        return
    }
    //Lisada andmete valideerimine
    let error =""
    const hike = getMatkModel(hikeId)
    if (!nimi && !email) {
        error = "Palun sisestage nimi ja email!"
    } else if (!email) {
        error = "Palun sisestage email!"
    } else if (!nimi) {
        error = "Palun sisestage nimi!"
    } else {
        // lihtne emaili muster
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRe.test(email)) {
            error = "Palun sisestage korrektne email"
        }
    } 
    if (error) {
        res.render('matk', {matk: hike, error: error, success: ""})
        return
    }
    const lisatud = addOsaleja(hikeId, nimi, email)
    if (!lisatud) {
        res.render('matk', {matk: hike, error: "Regristreerumine ebaõnnestus!", success: ""})
        return
    }

    res.render('matk', {matk: hike, error:"", success: "Olete regristreeritud!"})
}
