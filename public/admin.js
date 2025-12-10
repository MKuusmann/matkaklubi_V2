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
        nimi: hike.nimetus,
        kirjeldus: hike.kirjeldus,
        osalejad: hike.osalejad
    })
    rightPaneEl.innerHTML = rightPaneHTML
}

function getRightPaneHTML({nimi, kirjeldus, osalejad}) {
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
    `
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

async function initRender() {
    const hikes = await fetchAllHikes() 
    renderPage(hikes, hikes[0]?.id)
}

initRender()