import { getMatkadModel, getMatkModel } from '../model/matkad.js'


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
    res.send('Näitame matka ' + hike.nimetus)
}