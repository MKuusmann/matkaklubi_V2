

import {join} from 'path' 
import {writeFileSync, readFileSync} from 'fs' 

const hikesFilePath = join(process.cwd(), process.env.DATA_FILE_HIKES)


let matkad = []


export function initModel() {
    loadAllHikes()
}

function storeAllHikes() {
    writeFileSync(hikesFilePath, JSON.stringify(matkad))
}
function loadAllHikes() {
    const hikesString = readFileSync(hikesFilePath, 'utf-8')
    matkad = JSON.parse(hikesString)
}


export function getMatkadModel() {
    loadAllHikes() 
    return matkad
}

export function getMatkModel(hikeId) {
    loadAllHikes()
    const hike = matkad.find((matk) => {
        return matk.id === Number(hikeId)
    })
    if (!hike) {
        throw new Error("Matka ei leitud")
    }
    return hike
}

export function addOsaleja(hikeId, name, email) {
    const hike = getMatkModel(hikeId)
    if (!name || !email) {
        return false;
    }
    if (hike) {
        hike.osalejad.push({nimi: name, email: email})
        return true
    } else {
        return false
    }
}

export function addMatkModel({nimetus, kirjeldus, pildiUrl}) {
    const newId = matkad.length + 1
    const newMatk = {
        id: newId,
        nimetus,
        kirjeldus,
        pildiUrl: pildiUrl,
        osalejad: []
    }
    matkad.push(newMatk)

    storeAllHikes()

    return newId
}

export function deleteMatkModel(hikeId) {
    const hike = getMatkModel(hikeId)
    if (!hike) {
        throw new Error("Matka ei leitud")
    }
    
    matkad = matkad.filter((el) => {
        el.id !== hikeId
    })
}

export function patchMatkModel(id, {nimetus, kirjeldus}) {
    const matk = getMatkModel(id)
    if (!matk) {
        throw new Error("Matka ei leitud")
    }
    
    if (nimetus) {
        matk.nimetus = nimetus
    }
    if (kirjeldus) {
        matk.kirjeldus = kirjeldus
    }
    
    //const matkadIndex = matkad.findIndeks((el) => el.id === id)
/*
    matkad[id -1] = {
        ...matk,
        nimetus: (nimetus || matk.nimetus),
        kirjeldus: (kirjeldus || matk.kirjeldus)
    }
    */
}