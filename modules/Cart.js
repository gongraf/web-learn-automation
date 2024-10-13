class Cart {
    
    #maxItems  = 5
    #baseTotal = 150

    constructor() {
        this.items = []
    }

    getRandomCart() {
        this.total    = Math.round(this.#baseTotal+Math.random()*300)
        let tempTotal = this.total
        let qty = this.#maxItems
        this.items = []
        
        for(let i=0;i<this.#maxItems;i++){
            let temp      = Math.random()*tempTotal
            tempTotal     = tempTotal-temp
            this.items.push({name:`Product${i+1}`, price:temp.toFixed(1)})
        }
        
        //add extra item with the unassigned left
        if(tempTotal>0) {
            let remain = tempTotal.toFixed(1)
            this.items.push({name:`Product${this.#maxItems+1}`, price:remain})
            qty+=1
        }
        
        return {
            items: this.items,
            total: this.total,
            qty: qty
        }
    }
}
module.exports = new Cart()
