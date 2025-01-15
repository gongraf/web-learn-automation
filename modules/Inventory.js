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
            this.menuApi = JSON.parse(fs.readFileSync("./data/menu.json"))
        }
        catch(e) {
            console.log(e)
        }
    }

    getMenuApi(){
        return this.menuApi
    }

    filterItem(id) {
        return this.menuApi.data.find(item => {
            return item.id === id
        })
    }

    addItem(item){
        if(this.filterItem(item.id)!==undefined) {
            return 400
        }

        if(item.id===""||item.name===""||item.price===""||item.image==="") {
            return 400
        }

        let checkedItem = {
            id: item.id, 
            name: item.name, 
            image: item.image, 
            price: item.price.includes("$")?item.price:"$"+item.price
        }
        this.menuApi.data.push(checkedItem)
        return 200
    }
}

module.exports = new Inventory()