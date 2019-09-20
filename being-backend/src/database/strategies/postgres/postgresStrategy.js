const Sequelize = require('sequelize');
const ICrud = require('./../../../interfaces/ICrud');


class Postgres extends ICrud {
    constructor(connection, schema) {
        super();
        this._connection = connection
        this._schema = schema
    }

    static async connect() {
        const connection = new Sequelize(
            'olysrlev',
            'olysrlev',
            'U36A0g7EOJaHo_hpKFlMsKwgGthKiLeC',
            {
                host: 'raja.db.elephantsql.com',
                dialect: 'postgres',
                quoteIdentifiers: false,
                // operatorsAliases: false,
                logging: false
            }
        );
        return connection;
    }

    static async defineModel(connection, schema) {
        const model = connection.define(
            schema.name, schema.schema, schema.options
        );
        await model.sync();
        return model;
    }

    async isConected() {
        try {
            await this._connection.authenticate()
            return true;
        } catch (error) {
            console.error('No postgres nn deu, pai', error);
            return false;
        }
    }

    async create(item) {
        try {
            const { dataValues } = await this._schema.create(item)
            return dataValues;
        } catch (error) {
            console.error('Faio, papa', error);            
        }
    }

    async read(query = {}) {
        const result = this._schema.findAll({
            where: query,
            raw: true
        })
        return result;
    }

    update(id, newItem) {
        return this._schema.update(newItem, { where: { id } })
    }

    delete(id) {
        const query = id ? { id } : {}
        return this._schema.destroy({ where: query })
    }
}

module.exports = Postgres;
