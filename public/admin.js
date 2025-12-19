const allHikesUrl = '/api/matk'

async function clickOnLeftPaneItem(id) {
    console.log('Klikiti matka ID-l: '+id)
    if (!id) {
        renderErrorRightPane()
        return
    }
    const hikeDetails = await fetchHikeDetails(id)
    console.log(hikeDetails)
    renderRightPane(hikeDetails)
}

function getLeftPaneHTML(hikes) {
    let leftPaneHTML = ''
    hikes.forEach((hike) => {
        leftPaneHTML += `
            <div class="row" onClick="clickOnLeftPaneItem(${hike.id})">
            ${hike.nimetus}
            </div>
        `
    })
    leftPaneHTML += `<div class="btn btn-primary">Lisa matk</div>`
    return leftPaneHTML
}

function renderErrorRightPane() {
    const rightPaneEl = document.getElementById('right-pane')
    
    rightPaneEl.innerHTML = `
        <div class="alert">
            <h1>Ühtegi matka veel ei ole</h1>
        </div>
    `
}

function renderRightPane(hike) {
    const rightPaneEl = document.getElementById('right-pane')
    const rightPaneHTML = getRightPaneHTML({
        id: hike.id,
        nimi: hike.nimetus,
        kirjeldus: hike.kirjeldus,
        osalejad: hike.osalejad
    })
    rightPaneEl.innerHTML = rightPaneHTML
}

function getRightPaneHTML({id, nimi, kirjeldus, osalejad}) {
    let osalejateHTML = ''
    osalejad.forEach((osaleja) => {
        osalejateHTML += `
            <div class="row">
                <div class="col-6">${osaleja.nimi}</div>
                <div class="col-6">${osaleja.email}</div>
            </div>
        `
    })
    return `
        <h2>${nimi}</h2>
        <div class="row">${kirjeldus}</div>
        <h3>Osalejad</h3>
        <div class="row">
            <div class="col-6">Nimi</div>
            <div class="col-6">Email</div>
        </div>
        ${osalejateHTML}
        <div class="row">
            <div class="col-6">
                <input type="text" id="osalejaNimi">
            </div>
            <div class="col-6">
                <input type="text" id="osalejaEmail">
            </div>
            <div class="col-6">
                <button class="btn btn-link" onClick="addParticipant(${id})">Lisa osaleja</button>
            </div>
        </div>
    `
}

async function addParticipant(hikeId) {
    const name = document.getElementById('osalejaNimi').value
    const email = document.getElementById('osalejaEmail').value
    console.log(name, email)
    if (!name || !email) {
        return
    }
    await postHikeParticipant({
        id: hikeId,
        name: name,
        email: email
    })
    clickOnLeftPaneItem(hikeId)
}

function renderPage(hikes, hikeIdInRightPane = null) {
    const adminEl = document.getElementById('admin-konteiner')
    const leftPaneHTML = getLeftPaneHTML(hikes)
    const pageHTML = `
        <div class="row">
            <div class="col-4">${leftPaneHTML}</div>
            <div id="right-pane" class="col-8">Parem paan</div>
        </div>
    `
    adminEl.innerHTML = pageHTML

    clickOnLeftPaneItem(hikeIdInRightPane)
}
async function fetchAllHikes() {
    const response = await fetch(allHikesUrl)
    const hikes = await response.json()
    console.log('Päring lõpetatud.', hikes)
    return hikes
}

function showError(message) {
    console.log(message)
}

async function fetchHikeDetails(id) {
    const response = await fetch(allHikesUrl + '/' + id)
    if (!response.ok) {
        showError('Matka andmete päring ebaõnnestus')
        return null
    }
    const hike = await response.json()
    console.log('Ühe matka päring lõpetatud.', hike)
    return hike
}

async function postHikeParticipant({id, name, email}) {
    const participant = {
        nimi: name,
        email: email
    }
    const response = await fetch(`${allHikesUrl}/${id}/osaleja`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify(participant)
    })
    if (!response.ok) {
        showError('Osaleja lisamine ebaõnnestus')
        return null
    }
}

async function initRender() {
    const hikes = await fetchAllHikes() 
    renderPage(hikes, hikes[0]?.id)
}

initRender()