const BaseRoute = require('./base/baseRoute');
const Joi = require('joi')
const Boom = require('boom')

const failAction = (request, headers, erro) => { throw erro };
const headers = Joi.object({ authorization: Joi.string().required() }).unknown();

class ProjectsRoutes extends BaseRoute {
    constructor(db) {
        super();
        this._db = db;
    }

    list() {
        return {
            path: '/projects',
            method: 'GET',
            config: {
                validate: {
                    failAction,
                    headers,
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        title: Joi.string().min(3).max(100),
                    },
                },

                handler: (request, headers) => {
                    try {
                        const { skip, limit, title } = request.query;
                        const query = title ? {
                            title: { $regex: `.*${title}*.` }
                        } : {}

                        return this._db.read(query, skip, limit);
                    } catch (error) {
                        console.error('Moio pai', error);
                        return Boom.internal();

                    }
                }
            }
        }
    }


    create() {
        return {
            path: '/projects',
            method: 'POST',
            config: {
                validate: {
                    failAction,
                    headers,
                    payload: {
                        title: Joi.string().required().min(3).max(100),
                        owner: Joi.string().required().min(3).max(100),
                        status: Joi.number().required().default(1),
                    }

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
            path: '/projects/{id}',
            method: 'PATCH',
            config: {
                validate: {
                    failAction,
                    headers,
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        title: Joi.string().required().min(3).max(100),
                        owner: Joi.string().required().min(3).max(100),
                    }
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
            path: '/projects/{id}',
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

module.exports = ProjectsRoutes;