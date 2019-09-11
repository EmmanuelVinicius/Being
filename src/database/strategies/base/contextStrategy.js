const ICrud = require('./../../../interfaces/ICrud')

class ContextStrategy extends ICrud{
    constructor(strategy) {
        super()
        this._database = strategy
    }
    static connect(){
        return this._database.connect()
    }
    isConected(){
        return this._database.isConected()
    }
    create(item) {
        return this._database.create(item)
    }
    read(query, skip, limit) {
        return this._database.read(query, skip, limit)
    }
    update(id, item) {
        return this._database.update(id, item)
    }
    delete(id) {
        return this._database.delete(id)
    }
}

module.exports = ContextStrategy