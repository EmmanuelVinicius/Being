class NaoImplementadoPapai extends Error {
    constructor() {
        super("Aí deu ruim em, pai")
    }
}

class ICrud {
    isConected(){
        throw new NaoImplementadoPapai()
    }
    connect(){
        throw new NaoImplementadoPapai()
    }
    create(item) {
        throw new NaoImplementadoPapai()
    }
    read(query) {
        throw new NaoImplementadoPapai()
    }
    update(id, item) {
        throw new NaoImplementadoPapai()
    }
    delete(id) {
        throw new NaoImplementadoPapai()
    }
}

module.exports = ICrud