import { getMatkadModel, getMatkModel, addMatkModel, patchMatkModel, deleteMatkModel, addOsaleja } from '../model/matkadMongoDb.js'

export function apiAllHikesCntrl(req, res) {
    const matkad = getMatkadModel()
    res.json(matkad.map((matk) => {
        return {
            id: matk.id,
            nimetus: matk.nimetus,
            kirjeldus: matk.kirjeldus,
            osalejateArv: matk.osalejad.length
        }
    }))
}


export function apiGetHikeCntrl(req, res) {
    let matk = null
    try {
        matk = getMatkModel(req.params.id)
    } catch (error) {
        return res.status(404).json({error: error.message})
    }
    
    return res.json(matk)
}

export function apiAddHikeCntrl(req, res) {

    const newHike = {
        nimetus: req.body.nimetus,
        kirjeldus: req.body.kirjeldus,
        pildiUrl: req.body.pildiUrl || ''
    }
    addMatkModel(newHike)
    
    res.status(201).end()
}

export function apiOneHikeDetailsCntrl(req, res) {
    const matkaId = req.params.id
    if (!matkaId) {
        return res.status(403).json({
            error: 'Päringus pole antud matka ID-d'
        })
    }
    //TODO: loe ühe matka andmed ID alusel
    try {
        res.json(getMatkModel(matkaId))
    } catch (e) {
        return res.status(403).json({
            error: e.message
        })
    }
}

export function apiDeleteHikeCntrl(req, res) {
    // TODO: Luua DELETE funktsioon
    const hikeId = req.params.id
    try {
        deleteMatkModel(hikeId)
        res.status(204).end()
    } catch (error) {
        return res.status(403).json({error: error.message})
    } 
}

export function apiPatchHikeCntrl(req, res) {
    const hikeId = req.params.id
    const patch = {
        nimetus: req.body.nimetus,
        kirjeldus: req.body.kirjeldus
    }

    try {
        patchMatkModel(hikeId, patch)
        res.status(200).end()
    } catch (error) {
        res.status(403).json({error:error.message})
    }

}

export function apiHealthCntrl(req, res) {
    const uptime = process.uptime()
    res.status(200).json({status: "OK", uptime: uptime+" s"})
}

export function apiPostParticipantCntrl(req, res) {
    console.log(req.body)
    try {
        addOsaleja(req.params.id, req.body.nimi, req.body.email)
        res.status(201).end()
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}