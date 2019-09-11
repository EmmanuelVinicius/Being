const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');
const Boom = require('boom');
const Jwt = require('jsonwebtoken');

const failAction = (request, headers, erro) => {
    throw erro;
}
const USER = {
    username: 'prisrael',
    password: 'aliceanna'
}

class AuthRoutes extends BaseRoute {
    constructor(secret) {
        super();
        this._secret = secret;
    }
    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter o token de acesso',
                notes: 'Pega o token de login com usuario e senha',
                validate: {
                    failAction,
                    payload: {
                        email: Joi.string().email().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                const { username, password } = await request.payload;

                if (username !== USER.username || password !== USER.password)
                    return Boom.unauthorized();

                const token = Jwt.sign({
                    username,
                    id: 1
                }, this._secret)
                
                return { token }
        }
    }
}
}

module.exports = AuthRoutes;