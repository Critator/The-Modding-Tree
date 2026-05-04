let modInfo = {
    name: "DoE - Department of Everything",
    id: "department-of-everything",
    author: "Mundunugu",
    pointsName: "Coins",
    modFiles: ["layers.js", "tree.js"],

    discordName: "",
    discordLink: "",
    initialStartPoints: new Decimal(12),
    offlineLimit: 1,
}

let VERSION = {
    num: "0.3.1",
    name: "Pacing Rebalance"
}

let changelog = `<h1>Changelog:</h1><br>
<h3>v0.3.1 - Pacing Rebalance</h3><br>
- Rebalanced the early and mid Department pacing.<br>
- Building order now matters more.<br>
- Office and Paperwork are more meaningful strategic detours.<br>
`

let winText = `The Department is functioning.`

function getStartPoints() {
    return new Decimal(modInfo.initialStartPoints)
}

function canGenPoints() {
    return true
}

function getPointGen() {
    if (!canGenPoints()) return new Decimal(0)

    let gain = new Decimal(0)

    if (getBuyableAmount("d", 11).gt(0)) gain = gain.add(buyableEffect("d", 11)) // Parking Lot
    if (getBuyableAmount("d", 12).gt(0)) gain = gain.add(buyableEffect("d", 12)) // Kiosk
    if (getBuyableAmount("d", 15).gt(0)) gain = gain.add(buyableEffect("d", 15)) // Warehouse
    if (getBuyableAmount("d", 17).gt(0)) gain = gain.add(buyableEffect("d", 17)) // Transit Hub

    if (hasUpgrade("d", 63)) gain = gain.mul(1.10) // Distribution Contracts

    return gain
}

function addedPlayerData() { return {} }

function fixOldSave(oldVersion) {
}

let displayThings = [
    function () {
        let paperwork = (player.p && player.p.points) ? format(player.p.points) : "0"
        let paperworkPerSec = "0"

        if (tmp.p && tmp.p.paperworkGen) {
            paperworkPerSec = format(tmp.p.paperworkGen)
        }

        let nextGoal = "Expand the Department"

        if (getBuyableAmount("d", 11).lt(1)) nextGoal = "Buy Parking Lot"
        else if (getBuyableAmount("d", 12).lt(1)) nextGoal = "Buy Kiosk"
        else if (getBuyableAmount("d", 14).lt(1)) nextGoal = "Buy Office"
        else if (!hasUpgrade("d", 51)) nextGoal = "Buy Standard Offices"
        else if (getBuyableAmount("d", 15).lt(1)) nextGoal = "Buy Warehouse"
        else if (getBuyableAmount("d", 16).lt(1)) nextGoal = "Reach 18 Paperwork"
        else if (getBuyableAmount("d", 17).lt(1)) nextGoal = "Buy Transit Hub"
        else if (getBuyableAmount("d", 18).lt(1)) nextGoal = "Reach 60 Paperwork"

        return `
        <div style="
            border: 2px solid #8fb6d8;
            border-radius: 8px;
            padding: 8px 12px;
            margin: 6px auto 10px auto;
            background: rgba(0,0,0,0.18);
            text-align: center;
            max-width: 760px;
            line-height: 1.35;
            font-size: 0.9rem;
        ">
            <span style="color:#ffd166;"><b>${format(player.points)}</b> Coins</span>
            &nbsp;•&nbsp;
            <span style="color:#7fd96b;"><b>${format(getPointGen())}</b> Coins/sec</span>
            &nbsp;•&nbsp;
            <span style="color:#d5c1ff;"><b>${paperwork}</b> Paperwork</span>
            &nbsp;•&nbsp;
            <span style="color:#d5c1ff;"><b>${paperworkPerSec}</b> Paperwork/sec</span>
            <br>
            <span style="color:#9ecbff;">Next: ${nextGoal}</span>
        </div>
        `
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