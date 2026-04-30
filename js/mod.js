let modInfo = {
    name: "DoE - Department of Everything",
    id: "department-of-everything",
    author: "Mundunugu",
    pointsName: "Coins",
    modFiles: ["layers.js", "tree.js"],

    discordName: "",
    discordLink: "",
    initialStartPoints: new Decimal(10),
    offlineLimit: 1,
}

let VERSION = {
    num: "0.0.1",
    name: "Orientation Day"
}

let changelog = `<h1>Changelog:</h1><br>
<h3>v0.0.1 - Orientation Day</h3><br>
- Established Coins as the core currency.<br>
- Added the Department layer as the main operations hub.<br>
- Added starter buyables and upgrades.<br>
`

let winText = `You have successfully filed everything.`

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

function canGenPoints(){
    return true
}

function getPointGen() {
    if (!canGenPoints()) return new Decimal(0)

    let gain = new Decimal(0)

    if (getBuyableAmount("d", 11).gt(0)) gain = gain.add(buyableEffect("d", 11)) // Parking Lot
    if (getBuyableAmount("d", 12).gt(0)) gain = gain.add(buyableEffect("d", 12)) // Kiosk
    if (getBuyableAmount("d", 13).gt(0)) gain = gain.add(buyableEffect("d", 13)) // Farm

    if (hasUpgrade("d", 11)) gain = gain.mul(1.25) // Premium Asphalt
    if (hasUpgrade("d", 12)) gain = gain.mul(1.25) // Retail Optimization
    if (hasUpgrade("d", 13)) gain = gain.mul(1.25) // Fertile Subsidies

    return gain
}

function addedPlayerData() { return {} }

let displayThings = [
    function() {
        return `You are generating <b>${format(getPointGen())}</b> Coins/sec.`
    }
]

function isEndgame() {
    return false
}

var doNotCallTheseFunctionsEveryTick = []

var backgroundStyle = {}

function maxTickLength() {
    return 3600
}