

import {join} from 'path' 
import {writeFileSync, readFileSync} from 'fs' 

const hikesFilePath = join(process.cwd(), process.env.DATA_FILE_HIKES)


import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@nodekoolitus.smdq6yh.mongodb.net/?appName=NodeKoolitus`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


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
        throw new Error("Nimi ja email on kohustuslikud")
    }
    if (hike) {
        hike.osalejad.push({nimi: name, email: email})
        storeAllHikes()
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