const BaseRoute = require('./base/baseRoute');
const Joi = require('joi')
const Boom = require('boom')

const failAction = (request, headers, erro) => { throw erro };
const headers = Joi.object({ authorization: Joi.string().required() }).unknown();

class ItemsRoutes extends BaseRoute {
    constructor(db) {
        super();
        this._db = db;
    }

    list() {
        return {
            path: '/items',
            method: 'GET',
            config: {
                validate: {
                    failAction,
                    headers,
                    query: {
                        skip: Joi.number().integer(),
                        limit: Joi.number().integer(),
                        title: Joi.string().min(3).max(100),
                        owner: Joi.string().min(3).max(100),
                        status: Joi.number().integer(),
                        datetime: Joi.date(),
                        priority: Joi.number().integer()
                    },
                },

                handler: async (request, response) => {
                    try {
                        const {
                            skip,
                            limit,
                        } = request.query;

                        const stringData = JSON.stringify(request.query);

                        const data = JSON.parse(stringData);



                        return await this._db.read(data, skip, limit);
                    } catch (error) {
                        console.error('DEU RUIM', error)
                        return Boom.internal('Erro interno do servidor');
                    }
                }
            }
        }
    }


    create() {
        return {
            path: '/items',
            method: 'POST',
            config: {
                validate: {
                    failAction,
                    headers,
                    payload: {
                        title: Joi.string().required().min(3).max(100),
                        owner: Joi.string().required().min(3).max(100),
                        status: Joi.number().integer().default(1),
                        datetime: Joi.date(),
                        priority: Joi.number().integer().default(4)
                    },
                }
            },
            handler: async (request) => {
                try {
                    const dados = request.payload;
                    const result = await this._db.create(dados)
                    return {
                        message: 'Cadastrado com sucesso',
                        _id: result._id
                    }
                } catch (error) {
                    console.error('Moio papa', error);
                    return Boom.internal();
                }
            }
        }
    }

    update() {
        return {
            path: '/items/{id}',
            method: 'PATCH',
            config: {
                validate: {
                    failAction,
                    headers,
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        title: Joi.string().min(3).max(100),
                        owner: Joi.string().min(3).max(100),
                        status: Joi.number().integer(),
                        datetime: Joi.date(),
                        priority: Joi.number().integer()
                    },
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params;
                    const { payload } = request;
                    const dadosString = JSON.stringify(payload);

                    const dados = JSON.parse(dadosString);

                    const result = await this._db.update(id, dados);
                    if (result.nModified !== 1) return Boom.preconditionFailed('Deu erro, bixo!');
                    return {
                        message: 'Atualizado com sucesso'
                    }
                } catch (error) {
                    console.error('Moio, pai', error);
                    return Boom.internal();
                }
            }
        }
    }

    delete() {
        return {
            path: '/items/{id}',
            method: 'DELETE',
            config: {
                validate: {
                    failAction,
                    headers,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params;
                    const result = await this._db.delete(id);

                    if (result.n !== 1) return Boom.preconditionFailed('Deu erro, bixo!');
                    return { message: 'Removido com sucesso' }
                } catch (error) {
                    console.error('Moio, papito', error);
                    return Boom.internal();
                }
            }
        }
    }
}

module.exports = ItemsRoutes;