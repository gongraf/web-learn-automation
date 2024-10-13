const fs = require('fs')

class Inventory {

    constructor() {
        this.loadMenu()
    }

    getMenu() {
        return this.menu.data
    }

    loadMenu() {
        try{
            this.menu = JSON.parse(fs.readFileSync("./data/menu.json"))
        }
        catch(e) {
            console.log(e)
        }
    }
}

module.exports = new Inventory()