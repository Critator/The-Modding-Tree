addLayer("d", {
    name: "Department",
    symbol: "D",
    position: 0,
    row: 0,
    color: "#4BDC13",

    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},

    resource: "Operations",
    type: "none",

    layerShown() { return true },

    tooltip() {
        return "The Department of Everything"
    },

    tabFormat: [
        ["display-text", function() {
            return `You have <h2 style="color: #ffffff; display: inline">${formatWhole(player.points)}</h2> Coins`
        }],
        "blank",
        ["display-text", function() { return `You are generating <b>${format(getPointGen())}</b> Coins/sec.` }],
        "blank",
        ["display-text", function() { return "Build absurd departments to generate Coins." }],
        "blank",
        "buyables",
        "blank",
        "upgrades",
        "blank",
        "milestones",
    ],

    buyables: {
        rows: 2,
        cols: 4,

        11: {
            title: "Parking Lot",
            cost(x) {
                return new Decimal(10).mul(Decimal.pow(1.15, x))
            },
            display() {
                let amt = getBuyableAmount(this.layer, this.id)
                return "A paved rectangle of economic optimism.<br><br>" +
                    "Owned: " + formatWhole(amt) + "<br>" +
                    "Produces: " + format(this.effect()) + " Coins/sec<br><br>" +
                    "Cost: " + format(this.cost()) + " Coins"
            },
            canAfford() {
                return player.points.gte(this.cost())
            },
            buy() {
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            effect(x) {
                return x.mul(1)
            },
            unlocked() { return true },
        },

        12: {
            title: "Kiosk",
            cost(x) {
                return new Decimal(18).mul(Decimal.pow(1.16, x))
            },
            display() {
                let amt = getBuyableAmount(this.layer, this.id)
                return "Snacks, batteries, charms, and low-grade prophecy.<br><br>" +
                    "Owned: " + formatWhole(amt) + "<br>" +
                    "Produces: " + format(this.effect()) + " Coins/sec<br><br>" +
                    "Cost: " + format(this.cost()) + " Coins"
            },
            canAfford() {
                return player.points.gte(this.cost())
            },
            buy() {
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            effect(x) {
                return x.mul(1.2)
            },
            unlocked() { return true },
        },

        13: {
            title: "Farm",
            cost(x) {
                return new Decimal(16).mul(Decimal.pow(1.15, x))
            },
            display() {
                let amt = getBuyableAmount(this.layer, this.id)
                return "Corn, sheep, potion herbs, and zoning ambiguity.<br><br>" +
                    "Owned: " + formatWhole(amt) + "<br>" +
                    "Produces: " + format(this.effect()) + " Coins/sec<br><br>" +
                    "Cost: " + format(this.cost()) + " Coins"
            },
            canAfford() {
                return player.points.gte(this.cost())
            },
            buy() {
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            effect(x) {
                return x.mul(1.1)
            },
            unlocked() { return player.points.gte(30) || getBuyableAmount("d", 13).gt(0) },
        },

        14: {
            title: "Office",
            cost(x) {
                return new Decimal(24).mul(Decimal.pow(1.17, x))
            },
            display() {
                let amt = getBuyableAmount(this.layer, this.id)
                return "Forms generate more forms.<br><br>" +
                    "Owned: " + formatWhole(amt) + "<br>" +
                    "Reserved for future Paperwork systems.<br><br>" +
                    "Cost: " + format(this.cost()) + " Coins"
            },
            canAfford() {
                return player.points.gte(this.cost())
            },
            buy() {
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            effect(x) {
                return x
            },
            unlocked() { return getBuyableAmount("d", 11).gte(2) },
        },
    },

    upgrades: {
        11: {
            title: "Premium Asphalt",
            description: "Parking Lots produce 25% more Coins.",
            cost: new Decimal(40),
            currencyInternalName: "points",
            currencyDisplayName: "Coins",
            unlocked() { return getBuyableAmount("d", 11).gte(2) },
        },
        12: {
            title: "Retail Optimization",
            description: "Kiosks produce 25% more Coins.",
            cost: new Decimal(60),
            currencyInternalName: "points",
            currencyDisplayName: "Coins",
            unlocked() { return getBuyableAmount("d", 12).gte(1) },
        },
        13: {
            title: "Fertile Subsidies",
            description: "Farms produce 25% more Coins.",
            cost: new Decimal(55),
            currencyInternalName: "points",
            currencyDisplayName: "Coins",
            unlocked() { return getBuyableAmount("d", 13).gte(1) },
        },
        14: {
            title: "Standardized Forms",
            description: "Unlocks future bureaucracy expansion.",
            cost: new Decimal(75),
            currencyInternalName: "points",
            currencyDisplayName: "Coins",
            unlocked() { return getBuyableAmount("d", 14).gte(1) },
        },
    },

    milestones: {
        0: {
            requirementDescription: "Own 2 Parking Lots",
            done() { return getBuyableAmount("d", 11).gte(2) },
            effectDescription: "Unlock the Office.",
        },
        1: {
            requirementDescription: "Own 1 Kiosk",
            done() { return getBuyableAmount("d", 12).gte(1) },
            effectDescription: "Department logistics are improving.",
        },
        2: {
            requirementDescription: "Reach 100 Coins",
            done() { return player.points.gte(100) },
            effectDescription: "You are ready for the next department branch.",
        },
    },
})