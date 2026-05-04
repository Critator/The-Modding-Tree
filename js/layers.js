function doePanel(title, body, accent = "#ffffff") {
    return `
    <div style="
        border: 2px solid ${accent};
        border-radius: 8px;
        padding: 8px 12px;
        margin: 6px auto;
        background: rgba(0,0,0,0.16);
        text-align: center;
        max-width: 620px;
        line-height: 1.3;
    ">
        <div style="
            font-size: 0.70rem;
            letter-spacing: 0.07em;
            text-transform: uppercase;
            color: ${accent};
            margin-bottom: 4px;
            font-weight: bold;
        ">${title}</div>
        <div style="font-size: 0.90rem;">${body}</div>
    </div>`
}

function doeSectionHeader(text, color = "#cccccc") {
    return `
    <div style="
        text-align:center;
        margin:14px 0 8px 0;
        font-size:0.72rem;
        letter-spacing:0.08em;
        text-transform:uppercase;
        color:${color};
        font-weight:bold;
    ">${text}</div>`
}

function doeCheckRow(label, done, color = "#ffffff") {
    return `
    <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:10px;
        padding:5px 0;
        border-top: 1px solid rgba(255,255,255,0.08);
        font-size: 0.84rem;
    ">
        <div style="text-align:left; color:${color};">${label}</div>
        <div style="text-align:right;">
            ${done ? '<span style="color:#7fd96b"><b>Done</b></span>' : '<span style="color:#ffcf70"><b>In progress</b></span>'}
        </div>
    </div>`
}

function buildingState(requirementMet, affordable) {
    if (!requirementMet) return "locked"
    if (affordable) return "active"
    return "waiting"
}

function policyState(purchased, affordable) {
    if (purchased) return "owned"
    if (affordable) return "active"
    return "waiting"
}

function clickableStyle(border, state) {
    let bg = "#1b1b1b"
    let opacity = "1"
    let shadow = "none"

    if (state === "active") {
        bg = "#232323"
        shadow = "0 0 12px rgba(220, 228, 238, 0.8)"
    } else if (state === "owned") {
        bg = "#151515"
        opacity = "0.52"
    } else if (state === "locked") {
        bg = "#121212"
        opacity = "0.40"
    }

    return {
        "background-color": bg,
        "border": `2px solid ${border}`,
        "color": "#ffffff",
        "opacity": opacity,
        "box-shadow": shadow,
        "border-radius": "10px",
        "padding": "10px",
        "min-height": "150px",
        "max-height": "150px",
        "height": "150px",
        "width": "182px",
        "font-size": "0.79rem",
        "line-height": "1.18",
        "margin": "6px",
        "overflow": "hidden",
    }
}

function policyFooter(purchased, costText) {
    if (purchased) return `<span style="color:#aeb8c5"><b>Purchased</b></span>`
    return `<b>Cost:</b> ${costText}`
}

function estimatePayback(cost, output) {
    if (!output || output.lte(0)) return "—"
    return format(cost.div(output)) + "s"
}

function paperworkGenTotal() {
    let gain = new Decimal(0)
    if (getBuyableAmount("d", 14).gt(0)) gain = gain.add(buyableEffect("d", 14))
    if (getBuyableAmount("d", 16).gt(0)) gain = gain.add(buyableEffect("d", 16))
    if (getBuyableAmount("d", 18).gt(0)) gain = gain.add(buyableEffect("d", 18))
    if (hasUpgrade("d", 93)) gain = gain.mul(1.15)
    return gain
}

function departmentGoalText() {
    if (!getBuyableAmount("d", 11).gte(1)) return `Buy Parking Lot`
    if (!getBuyableAmount("d", 12).gte(1)) return `Buy Kiosk`
    if (!getBuyableAmount("d", 14).gte(1)) return `Buy Office`
    if (!hasUpgrade("d", 51)) return `Buy Standard Offices`
    if (!getBuyableAmount("d", 15).gte(1)) return `Buy Warehouse`
    if (!getBuyableAmount("d", 16).gte(1)) return `Reach 18 Paperwork`
    if (!getBuyableAmount("d", 17).gte(1)) return `Buy Transit Hub`
    if (!getBuyableAmount("d", 18).gte(1)) return `Reach 60 Paperwork`
    return `Expand Coins and Paperwork`
}

function overviewSummary() {
    let coins = format(player.points)
    let cps = format(getPointGen())
    let paperwork = player.p ? format(player.p.points) : "0"
    let pps = tmp.p ? format(tmp.p.paperworkGen) : "0"

    return doePanel(
        "Overview",
        `
        <b style="color:#ffd166">${coins}</b> Coins •
        <b style="color:#7fd96b">${cps}</b>/sec •
        <b style="color:#d5c1ff">${paperwork}</b> Paperwork •
        <b style="color:#d5c1ff">${pps}</b>/sec<br>
        <span style="color:#9ecbff">Next: ${departmentGoalText()}</span>
        `,
        "#8fb6d8"
    )
}

function overviewProgress() {
    return doePanel(
        "Progress",
        `
        ${doeCheckRow("Start Operations", getBuyableAmount("d", 11).gte(1), "#7fd96b")}
        ${doeCheckRow("Open Commerce", getBuyableAmount("d", 12).gte(1), "#90b7d8")}
        ${doeCheckRow("Open Bureaucracy", getBuyableAmount("d", 14).gte(1), "#b59ad6")}
        ${doeCheckRow("Launch Paperwork", hasUpgrade("d", 51), "#d5c1ff")}
        ${doeCheckRow("Expand Infrastructure", getBuyableAmount("d", 15).gte(1), "#d8b47a")}
        ${doeCheckRow("Open Permit Processing", getBuyableAmount("d", 16).gte(1), "#d5c1ff")}
        ${doeCheckRow("Establish Central Records", getBuyableAmount("d", 18).gte(1), "#e5d5ff")}
        `,
        "#9fb3c8"
    )
}

function paperworkOverviewPanel() {
    return doePanel(
        "Paperwork",
        `
        <b style="color:#d5c1ff">${format(player.p.points)}</b> Paperwork •
        <b style="color:#d5c1ff">${format(tmp.p.paperworkGen)}</b>/sec
        `,
        "#b59ad6"
    )
}

function buildingCardDisplay(data) {
    return `
    <div style="text-align:center;">
        <div style="font-size:0.74rem; color:${data.color}; margin-bottom:6px;">${data.role}</div>
        <div><b>Owned:</b> ${data.owned}</div>
        <div><b>Each:</b> ${data.each}</div>
        <div><b>Total:</b> ${data.total}</div>
        <div><b>Payback:</b> ${data.payback}</div>
        <div style="margin-top:8px;"><b>Cost:</b> ${data.cost}</div>
        <div style="margin-top:8px;">${data.status}</div>
    </div>`
}

addLayer("d", {
    name: "Department",
    symbol: "D",
    position: 0,
    row: 0,
    color: "#58c94f",

    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },

    resource: "Operations",
    type: "none",

    layerShown() { return true },
    tooltip() { return "The Department of Everything" },

    tabFormat: [
        ["microtabs", "main"],
    ],

    microtabs: {
        main: {
            Overview: {
                content: [
                    ["display-text", function () { return overviewSummary() }],
                    ["display-text", function () { return overviewProgress() }],
                ]
            },
            Buildings: {
                content: [
                    ["display-text", function () { return overviewSummary() }],
                    ["display-text", function () { return doeSectionHeader("Department Buildings", "#9fb3c8") }],
                    ["clickables", [1, 2]],
                    "blank",
                ]
            },
            Policies: {
                content: [
                    ["display-text", function () { return overviewSummary() }],
                    ["display-text", function () {
                        return doePanel(
                            "Budget",
                            `<b style="color:#ffd166">${format(player.points)}</b> Coins • <b style="color:#d5c1ff">${player.p ? format(player.p.points) : "0"}</b> Paperwork`,
                            "#9fb3c8"
                        )
                    }],
                    ["display-text", function () { return doeSectionHeader("Department Policies", "#9fb3c8") }],
                    ["clickables", [3, 4, 5, 6, 7, 8, 9]],
                    "blank",
                ]
            },
        }
    },

    buyables: {
        11: {
            cost(x) {
                let cost = new Decimal(8).mul(Decimal.pow(1.15, x))
                if (hasUpgrade("d", 31)) cost = cost.mul(0.85)
                if (hasUpgrade("d", 83)) cost = cost.mul(0.92)
                if (hasUpgrade("p", 12)) cost = cost.mul(0.90)
                return cost.ceil()
            },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                addBuyables("d", 11, 1)
            },
            effect(x) {
                let eff = x.mul(1)
                if (hasUpgrade("d", 32)) eff = eff.mul(1.25)
                return eff
            },
        },

        12: {
            cost(x) {
                let cost = new Decimal(22).mul(Decimal.pow(1.16, x))
                if (hasUpgrade("d", 42)) cost = cost.mul(0.85)
                if (hasUpgrade("d", 83)) cost = cost.mul(0.92)
                if (hasUpgrade("p", 12)) cost = cost.mul(0.90)
                return cost.ceil()
            },
            canAfford() {
                return (getBuyableAmount("d", 11).gte(1) || getBuyableAmount("d", 12).gt(0)) && player.points.gte(this.cost())
            },
            buy() {
                player.points = player.points.sub(this.cost())
                addBuyables("d", 12, 1)
            },
            effect(x) {
                let eff = x.mul(2.2)
                if (hasUpgrade("d", 41)) eff = eff.mul(1.5)
                if (hasUpgrade("d", 33)) eff = eff.mul(1.15)
                if (hasUpgrade("d", 83)) eff = eff.mul(1.15)
                return eff
            },
        },

        14: {
            cost(x) {
                let cost = new Decimal(30).mul(Decimal.pow(1.18, x))
                if (hasUpgrade("d", 52)) cost = cost.mul(0.85)
                if (hasUpgrade("d", 83)) cost = cost.mul(0.92)
                if (hasUpgrade("p", 12)) cost = cost.mul(0.90)
                return cost.ceil()
            },
            canAfford() {
                return (getBuyableAmount("d", 11).gte(2) || getBuyableAmount("d", 14).gt(0)) && player.points.gte(this.cost())
            },
            buy() {
                player.points = player.points.sub(this.cost())
                addBuyables("d", 14, 1)
            },
            effect(x) {
                let eff = x.mul(1)
                if (hasUpgrade("d", 53)) eff = eff.mul(1.5)
                if (hasUpgrade("d", 73)) eff = eff.mul(1.25)
                return eff
            },
        },

        15: {
            cost(x) {
                let cost = new Decimal(85).mul(Decimal.pow(1.20, x))
                if (hasUpgrade("d", 62)) cost = cost.mul(0.85)
                if (hasUpgrade("d", 43)) cost = cost.mul(0.90)
                if (hasUpgrade("d", 83)) cost = cost.mul(0.92)
                if (hasUpgrade("p", 12)) cost = cost.mul(0.90)
                return cost.ceil()
            },
            canAfford() {
                return (getBuyableAmount("d", 12).gte(2) || getBuyableAmount("d", 15).gt(0)) && player.points.gte(this.cost())
            },
            buy() {
                player.points = player.points.sub(this.cost())
                addBuyables("d", 15, 1)
            },
            effect(x) {
                let eff = x.mul(6)
                if (hasUpgrade("d", 61)) eff = eff.mul(1.4)
                return eff
            },
        },

        16: {
            cost(x) {
                let cost = new Decimal(70).mul(Decimal.pow(1.19, x))
                if (hasUpgrade("d", 72)) cost = cost.mul(0.85)
                if (hasUpgrade("d", 83)) cost = cost.mul(0.92)
                if (hasUpgrade("p", 12)) cost = cost.mul(0.90)
                return cost.ceil()
            },
            canAfford() {
                return (player.p.points.gte(18) || getBuyableAmount("d", 16).gt(0)) && player.points.gte(this.cost())
            },
            buy() {
                player.points = player.points.sub(this.cost())
                addBuyables("d", 16, 1)
            },
            effect(x) {
                let eff = x.mul(3)
                if (hasUpgrade("d", 71)) eff = eff.mul(1.5)
                return eff
            },
        },

        17: {
            cost(x) {
                let cost = new Decimal(120).mul(Decimal.pow(1.20, x))
                if (hasUpgrade("d", 81)) cost = cost.mul(0.85)
                if (hasUpgrade("d", 83)) cost = cost.mul(0.92)
                if (hasUpgrade("p", 12)) cost = cost.mul(0.90)
                return cost.ceil()
            },
            canAfford() {
                return (getBuyableAmount("d", 15).gte(1) || getBuyableAmount("d", 17).gt(0)) && player.points.gte(this.cost())
            },
            buy() {
                player.points = player.points.sub(this.cost())
                addBuyables("d", 17, 1)
            },
            effect(x) {
                let eff = x.mul(2.8)
                if (hasUpgrade("d", 82)) eff = eff.mul(1.5)
                return eff
            },
        },

        18: {
            cost(x) {
                let cost = new Decimal(150).mul(Decimal.pow(1.20, x))
                if (hasUpgrade("d", 92)) cost = cost.mul(0.85)
                if (hasUpgrade("d", 83)) cost = cost.mul(0.92)
                if (hasUpgrade("p", 12)) cost = cost.mul(0.90)
                return cost.ceil()
            },
            canAfford() {
                return (player.p.points.gte(60) || getBuyableAmount("d", 18).gt(0)) && player.points.gte(this.cost())
            },
            buy() {
                player.points = player.points.sub(this.cost())
                addBuyables("d", 18, 1)
            },
            effect(x) {
                let eff = x.mul(4)
                if (hasUpgrade("d", 91)) eff = eff.mul(1.5)
                return eff
            },
        },
    },

    upgrades: {
        31: { cost: new Decimal(18), currencyInternalName: "points", currencyDisplayName: "Coins", unlocked() { return getBuyableAmount("d", 11).gte(1) } },
        32: { cost: new Decimal(34), currencyInternalName: "points", currencyDisplayName: "Coins", unlocked() { return getBuyableAmount("d", 11).gte(2) } },
        33: { cost: new Decimal(55), currencyInternalName: "points", currencyDisplayName: "Coins", unlocked() { return getBuyableAmount("d", 12).gte(1) } },

        41: { cost: new Decimal(40), currencyInternalName: "points", currencyDisplayName: "Coins", unlocked() { return getBuyableAmount("d", 12).gte(1) } },
        42: { cost: new Decimal(60), currencyInternalName: "points", currencyDisplayName: "Coins", unlocked() { return getBuyableAmount("d", 12).gte(2) } },
        43: { cost: new Decimal(85), currencyInternalName: "points", currencyDisplayName: "Coins", unlocked() { return getBuyableAmount("d", 15).gte(1) } },

        51: { cost: new Decimal(55), currencyInternalName: "points", currencyDisplayName: "Coins", unlocked() { return getBuyableAmount("d", 14).gte(1) } },
        52: { cost: new Decimal(12), currencyInternalName: "points", currencyLayer: "p", currencyDisplayName: "Paperwork", unlocked() { return hasUpgrade("d", 51) } },
        53: { cost: new Decimal(28), currencyInternalName: "points", currencyLayer: "p", currencyDisplayName: "Paperwork", unlocked() { return hasUpgrade("d", 51) } },

        61: { cost: new Decimal(110), currencyInternalName: "points", currencyDisplayName: "Coins", unlocked() { return getBuyableAmount("d", 15).gte(1) } },
        62: { cost: new Decimal(135), currencyInternalName: "points", currencyDisplayName: "Coins", unlocked() { return getBuyableAmount("d", 15).gte(2) } },
        63: { cost: new Decimal(165), currencyInternalName: "points", currencyDisplayName: "Coins", unlocked() { return getBuyableAmount("d", 15).gte(2) } },

        71: { cost: new Decimal(22), currencyInternalName: "points", currencyLayer: "p", currencyDisplayName: "Paperwork", unlocked() { return getBuyableAmount("d", 16).gte(1) } },
        72: { cost: new Decimal(34), currencyInternalName: "points", currencyLayer: "p", currencyDisplayName: "Paperwork", unlocked() { return getBuyableAmount("d", 16).gte(1) } },
        73: { cost: new Decimal(50), currencyInternalName: "points", currencyLayer: "p", currencyDisplayName: "Paperwork", unlocked() { return getBuyableAmount("d", 16).gte(2) } },

        81: { cost: new Decimal(145), currencyInternalName: "points", currencyDisplayName: "Coins", unlocked() { return getBuyableAmount("d", 17).gte(1) } },
        82: { cost: new Decimal(175), currencyInternalName: "points", currencyDisplayName: "Coins", unlocked() { return getBuyableAmount("d", 17).gte(1) } },
        83: { cost: new Decimal(75), currencyInternalName: "points", currencyLayer: "p", currencyDisplayName: "Paperwork", unlocked() { return getBuyableAmount("d", 17).gte(1) } },

        91: { cost: new Decimal(48), currencyInternalName: "points", currencyLayer: "p", currencyDisplayName: "Paperwork", unlocked() { return getBuyableAmount("d", 18).gte(1) } },
        92: { cost: new Decimal(68), currencyInternalName: "points", currencyLayer: "p", currencyDisplayName: "Paperwork", unlocked() { return getBuyableAmount("d", 18).gte(1) } },
        93: { cost: new Decimal(95), currencyInternalName: "points", currencyLayer: "p", currencyDisplayName: "Paperwork", unlocked() { return getBuyableAmount("d", 18).gte(2) } },
    },

    clickables: {
        rows: 9,
        cols: 4,

        11: {
            title: "Parking Lot",
            canClick() { return tmp.d.buyables[11].canAfford },
            onClick() { buyBuyable("d", 11) },
            display() {
                let amt = getBuyableAmount("d", 11)
                let cost = layers.d.buyables[11].cost(amt)
                let output = new Decimal(1)
                let affordable = player.points.gte(cost)
                return buildingCardDisplay({
                    color: "#9be58f",
                    role: "Fast Start",
                    owned: formatWhole(amt),
                    each: `${format(output)} Coin/sec`,
                    total: `${format(buyableEffect("d", 11))} /sec`,
                    payback: estimatePayback(cost, output),
                    cost: format(cost),
                    status: affordable ? '<span style="color:#7fd96b"><b>BUY NOW</b></span>' : `<span style="color:#ffcf70">Need ${format(cost.sub(player.points).max(0))}</span>`
                })
            },
            style() {
                let amt = getBuyableAmount("d", 11)
                let cost = layers.d.buyables[11].cost(amt)
                return clickableStyle("#7fd96b", player.points.gte(cost) ? "active" : "waiting")
            },
            unlocked() { return true },
        },

        12: {
            title: "Kiosk",
            canClick() { return tmp.d.buyables[12].canAfford },
            onClick() { buyBuyable("d", 12) },
            display() {
                let amt = getBuyableAmount("d", 12)
                let cost = layers.d.buyables[12].cost(amt)
                let reqMet = getBuyableAmount("d", 11).gte(1) || amt.gt(0)
                let affordable = reqMet && player.points.gte(cost)
                let output = hasUpgrade("d", 41) ? new Decimal(3.3) : new Decimal(2.2)
                return buildingCardDisplay({
                    color: "#9fc9ea",
                    role: "Early Efficiency",
                    owned: formatWhole(amt),
                    each: `${format(output)} Coin/sec`,
                    total: `${format(buyableEffect("d", 12))} /sec`,
                    payback: estimatePayback(cost, output),
                    cost: format(cost),
                    status: !reqMet ? '<span style="color:#ff8e8e">Locked</span>' : affordable ? '<span style="color:#7fd96b"><b>BUY NOW</b></span>' : `<span style="color:#ffcf70">Need ${format(cost.sub(player.points).max(0))}</span>`
                })
            },
            style() {
                let amt = getBuyableAmount("d", 12)
                let cost = layers.d.buyables[12].cost(amt)
                let reqMet = getBuyableAmount("d", 11).gte(1) || amt.gt(0)
                let affordable = reqMet && player.points.gte(cost)
                return clickableStyle("#87b4d6", buildingState(reqMet, affordable))
            },
            unlocked() { return true },
        },

        13: {
            title: "Office",
            canClick() { return tmp.d.buyables[14].canAfford },
            onClick() { buyBuyable("d", 14) },
            display() {
                let amt = getBuyableAmount("d", 14)
                let cost = layers.d.buyables[14].cost(amt)
                let reqMet = getBuyableAmount("d", 11).gte(2) || amt.gt(0)
                let affordable = reqMet && player.points.gte(cost)
                let output = hasUpgrade("d", 53) ? new Decimal(1.5) : new Decimal(1)
                return buildingCardDisplay({
                    color: "#c8b1e3",
                    role: "Unlock Path",
                    owned: formatWhole(amt),
                    each: `${format(output)} Paperwork/sec`,
                    total: `${format(buyableEffect("d", 14))} /sec`,
                    payback: "unlock",
                    cost: format(cost),
                    status: !reqMet ? '<span style="color:#ff8e8e">Locked</span>' : affordable ? '<span style="color:#7fd96b"><b>BUY NOW</b></span>' : `<span style="color:#ffcf70">Need ${format(cost.sub(player.points).max(0))}</span>`
                })
            },
            style() {
                let amt = getBuyableAmount("d", 14)
                let cost = layers.d.buyables[14].cost(amt)
                let reqMet = getBuyableAmount("d", 11).gte(2) || amt.gt(0)
                let affordable = reqMet && player.points.gte(cost)
                return clickableStyle("#b59ad6", buildingState(reqMet, affordable))
            },
            unlocked() { return true },
        },

        14: {
            title: "Warehouse",
            canClick() { return tmp.d.buyables[15].canAfford },
            onClick() { buyBuyable("d", 15) },
            display() {
                let amt = getBuyableAmount("d", 15)
                let cost = layers.d.buyables[15].cost(amt)
                let reqMet = getBuyableAmount("d", 12).gte(2) || amt.gt(0)
                let affordable = reqMet && player.points.gte(cost)
                let output = hasUpgrade("d", 61) ? new Decimal(8.4) : new Decimal(6)
                return buildingCardDisplay({
                    color: "#d9b681",
                    role: "Long-Term Coins",
                    owned: formatWhole(amt),
                    each: `${format(output)} Coin/sec`,
                    total: `${format(buyableEffect("d", 15))} /sec`,
                    payback: estimatePayback(cost, output),
                    cost: format(cost),
                    status: !reqMet ? '<span style="color:#ff8e8e">Locked</span>' : affordable ? '<span style="color:#7fd96b"><b>BUY NOW</b></span>' : `<span style="color:#ffcf70">Need ${format(cost.sub(player.points).max(0))}</span>`
                })
            },
            style() {
                let amt = getBuyableAmount("d", 15)
                let cost = layers.d.buyables[15].cost(amt)
                let reqMet = getBuyableAmount("d", 12).gte(2) || amt.gt(0)
                let affordable = reqMet && player.points.gte(cost)
                return clickableStyle("#d0a96b", buildingState(reqMet, affordable))
            },
            unlocked() { return true },
        },

        21: {
            title: "Permit Desk",
            canClick() { return tmp.d.buyables[16].canAfford },
            onClick() { buyBuyable("d", 16) },
            display() {
                let amt = getBuyableAmount("d", 16)
                let cost = layers.d.buyables[16].cost(amt)
                let reqMet = player.p.points.gte(18) || amt.gt(0)
                let affordable = reqMet && player.points.gte(cost)
                let output = hasUpgrade("d", 71) ? new Decimal(4.5) : new Decimal(3)
                return buildingCardDisplay({
                    color: "#d7c0ee",
                    role: "Paperwork Scaling",
                    owned: formatWhole(amt),
                    each: `${format(output)} Paperwork/sec`,
                    total: `${format(buyableEffect("d", 16))} /sec`,
                    payback: "admin",
                    cost: format(cost),
                    status: !reqMet ? '<span style="color:#ff8e8e">Locked</span>' : affordable ? '<span style="color:#7fd96b"><b>BUY NOW</b></span>' : `<span style="color:#ffcf70">Need ${format(cost.sub(player.points).max(0))}</span>`
                })
            },
            style() {
                let amt = getBuyableAmount("d", 16)
                let cost = layers.d.buyables[16].cost(amt)
                let reqMet = player.p.points.gte(18) || amt.gt(0)
                let affordable = reqMet && player.points.gte(cost)
                return clickableStyle("#ceb2e8", buildingState(reqMet, affordable))
            },
            unlocked() { return true },
        },

        22: {
            title: "Transit Hub",
            canClick() { return tmp.d.buyables[17].canAfford },
            onClick() { buyBuyable("d", 17) },
            display() {
                let amt = getBuyableAmount("d", 17)
                let cost = layers.d.buyables[17].cost(amt)
                let reqMet = getBuyableAmount("d", 15).gte(1) || amt.gt(0)
                let affordable = reqMet && player.points.gte(cost)
                let output = hasUpgrade("d", 82) ? new Decimal(4.2) : new Decimal(2.8)
                return buildingCardDisplay({
                    color: "#a8d0d0",
                    role: "Utility Support",
                    owned: formatWhole(amt),
                    each: `${format(output)} Coin/sec`,
                    total: `${format(buyableEffect("d", 17))} /sec`,
                    payback: "support",
                    cost: format(cost),
                    status: !reqMet ? '<span style="color:#ff8e8e">Locked</span>' : affordable ? '<span style="color:#7fd96b"><b>BUY NOW</b></span>' : `<span style="color:#ffcf70">Need ${format(cost.sub(player.points).max(0))}</span>`
                })
            },
            style() {
                let amt = getBuyableAmount("d", 17)
                let cost = layers.d.buyables[17].cost(amt)
                let reqMet = getBuyableAmount("d", 15).gte(1) || amt.gt(0)
                let affordable = reqMet && player.points.gte(cost)
                return clickableStyle("#9ccaca", buildingState(reqMet, affordable))
            },
            unlocked() { return true },
        },

        23: {
            title: "Records Archive",
            canClick() { return tmp.d.buyables[18].canAfford },
            onClick() { buyBuyable("d", 18) },
            display() {
                let amt = getBuyableAmount("d", 18)
                let cost = layers.d.buyables[18].cost(amt)
                let reqMet = player.p.points.gte(60) || amt.gt(0)
                let affordable = reqMet && player.points.gte(cost)
                let output = hasUpgrade("d", 91) ? new Decimal(6) : new Decimal(4)
                return buildingCardDisplay({
                    color: "#e5d5ff",
                    role: "Late Admin",
                    owned: formatWhole(amt),
                    each: `${format(output)} Paperwork/sec`,
                    total: `${format(buyableEffect("d", 18))} /sec`,
                    payback: "late",
                    cost: format(cost),
                    status: !reqMet ? '<span style="color:#ff8e8e">Locked</span>' : affordable ? '<span style="color:#7fd96b"><b>BUY NOW</b></span>' : `<span style="color:#ffcf70">Need ${format(cost.sub(player.points).max(0))}</span>`
                })
            },
            style() {
                let amt = getBuyableAmount("d", 18)
                let cost = layers.d.buyables[18].cost(amt)
                let reqMet = player.p.points.gte(60) || amt.gt(0)
                let affordable = reqMet && player.points.gte(cost)
                return clickableStyle("#e0d0f2", buildingState(reqMet, affordable))
            },
            unlocked() { return true },
        },

        31: {
            title: "Site Planning",
            canClick() { return !hasUpgrade("d", 31) && canAffordUpgrade("d", 31) },
            onClick() { buyUpg("d", 31) },
            display() { let p = hasUpgrade("d", 31); return `<div style="text-align:center;"><div>Parking Lots cost 15% less.</div><div style="margin-top:12px;">${policyFooter(p, "18 Coins")}</div></div>` },
            style() { return clickableStyle("#7fd96b", policyState(hasUpgrade("d", 31), canAffordUpgrade("d", 31))) },
            unlocked() { return getBuyableAmount("d", 11).gte(1) },
        },
        32: {
            title: "Premium Asphalt",
            canClick() { return !hasUpgrade("d", 32) && canAffordUpgrade("d", 32) },
            onClick() { buyUpg("d", 32) },
            display() { let p = hasUpgrade("d", 32); return `<div style="text-align:center;"><div>Parking Lots produce 25% more Coins.</div><div style="margin-top:12px;">${policyFooter(p, "34 Coins")}</div></div>` },
            style() { return clickableStyle("#7fd96b", policyState(hasUpgrade("d", 32), canAffordUpgrade("d", 32))) },
            unlocked() { return getBuyableAmount("d", 11).gte(2) },
        },
        33: {
            title: "Overflow Routing",
            canClick() { return !hasUpgrade("d", 33) && canAffordUpgrade("d", 33) },
            onClick() { buyUpg("d", 33) },
            display() { let p = hasUpgrade("d", 33); return `<div style="text-align:center;"><div>Kiosks produce 15% more Coins.</div><div style="margin-top:12px;">${policyFooter(p, "55 Coins")}</div></div>` },
            style() { return clickableStyle("#7fd96b", policyState(hasUpgrade("d", 33), canAffordUpgrade("d", 33))) },
            unlocked() { return getBuyableAmount("d", 12).gte(1) },
        },

        41: {
            title: "Retail Optimization",
            canClick() { return !hasUpgrade("d", 41) && canAffordUpgrade("d", 41) },
            onClick() { buyUpg("d", 41) },
            display() { let p = hasUpgrade("d", 41); return `<div style="text-align:center;"><div>Kiosks produce 50% more Coins.</div><div style="margin-top:12px;">${policyFooter(p, "40 Coins")}</div></div>` },
            style() { return clickableStyle("#87b4d6", policyState(hasUpgrade("d", 41), canAffordUpgrade("d", 41))) },
            unlocked() { return getBuyableAmount("d", 12).gte(1) },
        },
        42: {
            title: "Impulse Displays",
            canClick() { return !hasUpgrade("d", 42) && canAffordUpgrade("d", 42) },
            onClick() { buyUpg("d", 42) },
            display() { let p = hasUpgrade("d", 42); return `<div style="text-align:center;"><div>Kiosks cost 15% less.</div><div style="margin-top:12px;">${policyFooter(p, "60 Coins")}</div></div>` },
            style() { return clickableStyle("#87b4d6", policyState(hasUpgrade("d", 42), canAffordUpgrade("d", 42))) },
            unlocked() { return getBuyableAmount("d", 12).gte(2) },
        },
        43: {
            title: "Commercial Foot Traffic",
            canClick() { return !hasUpgrade("d", 43) && canAffordUpgrade("d", 43) },
            onClick() { buyUpg("d", 43) },
            display() { let p = hasUpgrade("d", 43); return `<div style="text-align:center;"><div>Warehouses cost 10% less.</div><div style="margin-top:12px;">${policyFooter(p, "85 Coins")}</div></div>` },
            style() { return clickableStyle("#87b4d6", policyState(hasUpgrade("d", 43), canAffordUpgrade("d", 43))) },
            unlocked() { return getBuyableAmount("d", 15).gte(1) },
        },

        51: {
            title: "Standard Offices",
            canClick() { return !hasUpgrade("d", 51) && canAffordUpgrade("d", 51) },
            onClick() { buyUpg("d", 51) },
            display() { let p = hasUpgrade("d", 51); return `<div style="text-align:center;"><div>Unlock the Paperwork layer.</div><div style="margin-top:12px;">${policyFooter(p, "55 Coins")}</div></div>` },
            style() { return clickableStyle("#b59ad6", policyState(hasUpgrade("d", 51), canAffordUpgrade("d", 51))) },
            unlocked() { return getBuyableAmount("d", 14).gte(1) },
        },
        52: {
            title: "Desk Consolidation",
            canClick() { return !hasUpgrade("d", 52) && canAffordUpgrade("d", 52) },
            onClick() { buyUpg("d", 52) },
            display() { let p = hasUpgrade("d", 52); return `<div style="text-align:center;"><div>Offices cost 15% less.</div><div style="margin-top:12px;">${policyFooter(p, "12 Paperwork")}</div></div>` },
            style() { return clickableStyle("#b59ad6", policyState(hasUpgrade("d", 52), canAffordUpgrade("d", 52))) },
            unlocked() { return hasUpgrade("d", 51) },
        },
        53: {
            title: "Administrative Training",
            canClick() { return !hasUpgrade("d", 53) && canAffordUpgrade("d", 53) },
            onClick() { buyUpg("d", 53) },
            display() { let p = hasUpgrade("d", 53); return `<div style="text-align:center;"><div>Offices produce 50% more Paperwork.</div><div style="margin-top:12px;">${policyFooter(p, "28 Paperwork")}</div></div>` },
            style() { return clickableStyle("#b59ad6", policyState(hasUpgrade("d", 53), canAffordUpgrade("d", 53))) },
            unlocked() { return hasUpgrade("d", 51) },
        },

        61: {
            title: "Bulk Storage",
            canClick() { return !hasUpgrade("d", 61) && canAffordUpgrade("d", 61) },
            onClick() { buyUpg("d", 61) },
            display() { let p = hasUpgrade("d", 61); return `<div style="text-align:center;"><div>Warehouses produce 40% more Coins.</div><div style="margin-top:12px;">${policyFooter(p, "110 Coins")}</div></div>` },
            style() { return clickableStyle("#d0a96b", policyState(hasUpgrade("d", 61), canAffordUpgrade("d", 61))) },
            unlocked() { return getBuyableAmount("d", 15).gte(1) },
        },
        62: {
            title: "Loading Efficiency",
            canClick() { return !hasUpgrade("d", 62) && canAffordUpgrade("d", 62) },
            onClick() { buyUpg("d", 62) },
            display() { let p = hasUpgrade("d", 62); return `<div style="text-align:center;"><div>Warehouses cost 15% less.</div><div style="margin-top:12px;">${policyFooter(p, "135 Coins")}</div></div>` },
            style() { return clickableStyle("#d0a96b", policyState(hasUpgrade("d", 62), canAffordUpgrade("d", 62))) },
            unlocked() { return getBuyableAmount("d", 15).gte(2) },
        },
        63: {
            title: "Distribution Contracts",
            canClick() { return !hasUpgrade("d", 63) && canAffordUpgrade("d", 63) },
            onClick() { buyUpg("d", 63) },
            display() { let p = hasUpgrade("d", 63); return `<div style="text-align:center;"><div>All Coin gain +10%.</div><div style="margin-top:12px;">${policyFooter(p, "165 Coins")}</div></div>` },
            style() { return clickableStyle("#d0a96b", policyState(hasUpgrade("d", 63), canAffordUpgrade("d", 63))) },
            unlocked() { return getBuyableAmount("d", 15).gte(2) },
        },

        71: {
            title: "Form Templates",
            canClick() { return !hasUpgrade("d", 71) && canAffordUpgrade("d", 71) },
            onClick() { buyUpg("d", 71) },
            display() { let p = hasUpgrade("d", 71); return `<div style="text-align:center;"><div>Permit Desks produce 50% more Paperwork.</div><div style="margin-top:12px;">${policyFooter(p, "22 Paperwork")}</div></div>` },
            style() { return clickableStyle("#ceb2e8", policyState(hasUpgrade("d", 71), canAffordUpgrade("d", 71))) },
            unlocked() { return getBuyableAmount("d", 16).gte(1) },
        },
        72: {
            title: "Clerical Routing",
            canClick() { return !hasUpgrade("d", 72) && canAffordUpgrade("d", 72) },
            onClick() { buyUpg("d", 72) },
            display() { let p = hasUpgrade("d", 72); return `<div style="text-align:center;"><div>Permit Desks cost 15% less.</div><div style="margin-top:12px;">${policyFooter(p, "34 Paperwork")}</div></div>` },
            style() { return clickableStyle("#ceb2e8", policyState(hasUpgrade("d", 72), canAffordUpgrade("d", 72))) },
            unlocked() { return getBuyableAmount("d", 16).gte(1) },
        },
        73: {
            title: "Expedited Review",
            canClick() { return !hasUpgrade("d", 73) && canAffordUpgrade("d", 73) },
            onClick() { buyUpg("d", 73) },
            display() { let p = hasUpgrade("d", 73); return `<div style="text-align:center;"><div>Offices produce 25% more Paperwork.</div><div style="margin-top:12px;">${policyFooter(p, "50 Paperwork")}</div></div>` },
            style() { return clickableStyle("#ceb2e8", policyState(hasUpgrade("d", 73), canAffordUpgrade("d", 73))) },
            unlocked() { return getBuyableAmount("d", 16).gte(2) },
        },

        81: {
            title: "Route Mapping",
            canClick() { return !hasUpgrade("d", 81) && canAffordUpgrade("d", 81) },
            onClick() { buyUpg("d", 81) },
            display() { let p = hasUpgrade("d", 81); return `<div style="text-align:center;"><div>Transit Hubs cost 15% less.</div><div style="margin-top:12px;">${policyFooter(p, "145 Coins")}</div></div>` },
            style() { return clickableStyle("#9ccaca", policyState(hasUpgrade("d", 81), canAffordUpgrade("d", 81))) },
            unlocked() { return getBuyableAmount("d", 17).gte(1) },
        },
        82: {
            title: "Logistics Coordination",
            canClick() { return !hasUpgrade("d", 82) && canAffordUpgrade("d", 82) },
            onClick() { buyUpg("d", 82) },
            display() { let p = hasUpgrade("d", 82); return `<div style="text-align:center;"><div>Transit Hubs produce 50% more Coins.</div><div style="margin-top:12px;">${policyFooter(p, "175 Coins")}</div></div>` },
            style() { return clickableStyle("#9ccaca", policyState(hasUpgrade("d", 82), canAffordUpgrade("d", 82))) },
            unlocked() { return getBuyableAmount("d", 17).gte(1) },
        },
        83: {
            title: "Interdepartmental Access",
            canClick() { return !hasUpgrade("d", 83) && canAffordUpgrade("d", 83) },
            onClick() { buyUpg("d", 83) },
            display() { let p = hasUpgrade("d", 83); return `<div style="text-align:center;"><div>All buildings cost 8% less. Kiosks +15% Coins.</div><div style="margin-top:12px;">${policyFooter(p, "75 Paperwork")}</div></div>` },
            style() { return clickableStyle("#9ccaca", policyState(hasUpgrade("d", 83), canAffordUpgrade("d", 83))) },
            unlocked() { return getBuyableAmount("d", 17).gte(1) },
        },

        91: {
            title: "Archive Cataloguing",
            canClick() { return !hasUpgrade("d", 91) && canAffordUpgrade("d", 91) },
            onClick() { buyUpg("d", 91) },
            display() { let p = hasUpgrade("d", 91); return `<div style="text-align:center;"><div>Records Archives produce 50% more Paperwork.</div><div style="margin-top:12px;">${policyFooter(p, "48 Paperwork")}</div></div>` },
            style() { return clickableStyle("#e0d0f2", policyState(hasUpgrade("d", 91), canAffordUpgrade("d", 91))) },
            unlocked() { return getBuyableAmount("d", 18).gte(1) },
        },
        92: {
            title: "Document Preservation",
            canClick() { return !hasUpgrade("d", 92) && canAffordUpgrade("d", 92) },
            onClick() { buyUpg("d", 92) },
            display() { let p = hasUpgrade("d", 92); return `<div style="text-align:center;"><div>Records Archives cost 15% less.</div><div style="margin-top:12px;">${policyFooter(p, "68 Paperwork")}</div></div>` },
            style() { return clickableStyle("#e0d0f2", policyState(hasUpgrade("d", 92), canAffordUpgrade("d", 92))) },
            unlocked() { return getBuyableAmount("d", 18).gte(1) },
        },
        93: {
            title: "Historical Indexing",
            canClick() { return !hasUpgrade("d", 93) && canAffordUpgrade("d", 93) },
            onClick() { buyUpg("d", 93) },
            display() { let p = hasUpgrade("d", 93); return `<div style="text-align:center;"><div>All Paperwork gain +15%.</div><div style="margin-top:12px;">${policyFooter(p, "95 Paperwork")}</div></div>` },
            style() { return clickableStyle("#e0d0f2", policyState(hasUpgrade("d", 93), canAffordUpgrade("d", 93))) },
            unlocked() { return getBuyableAmount("d", 18).gte(2) },
        },
    },
})

addLayer("p", {
    name: "Paperwork",
    symbol: "P",
    position: 1,
    row: 0,
    color: "#9b6cff",

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
        }
    },

    resource: "Paperwork",
    baseResource: "Coins",
    baseAmount() { return player.points },
    type: "none",

    layerShown() {
        return hasUpgrade("d", 51) || player.p.unlocked
    },

    tooltip() {
        return "Permits, approvals, forms, compliance, and administrative force."
    },

    tabFormat: [
        ["display-text", function () { return paperworkOverviewPanel() }],
        "blank",
    ],

    update(diff) {
        if (hasUpgrade("d", 51)) player.p.unlocked = true
        player.p.points = player.p.points.add(tmp.p.paperworkGen.mul(diff))
    },

    paperworkGen() {
        return paperworkGenTotal()
    },
})