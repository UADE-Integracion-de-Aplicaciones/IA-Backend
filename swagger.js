const swaggerAutogen = require('swagger-autogen')()

const outputFile = './resource/swagger/swagger_output.json'
const endpointsFiles = ['./src/routes/client.routes.js', './src/routes/user.routes.js']

const doc = {
    info: {
        version: "1.0.0",
        title: "Integracion de Aplicaciones - BANCO",
        description: "Endpoints del proyecto del banco del grupo 5, para la amteria de Integracion de Aplicaciones - UADE"
    },
    host: "localhost:8080",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "Usuario",
            "description": "Endpoints"
        },
        {
            "name": "Cliente",
            "description": "Endpoints"
        }
    ],
    securityDefinitions: {
        api_key: {
            type: "apiKey",
            name: "api_key",
            in: "header"
        },
        petstore_auth: {
            type: "oauth2",
            authorizationUrl: "https://petstore.swagger.io/oauth/authorize",
            flow: "implicit",
            scopes: {
                read_pets: "read your pets",
                write_pets: "modify pets in your account"
            }
        }
    },
    definitions: {
        User: {
            name: "Jhon Doe",
            age: 29,
            parents: {
                father: "Simon Doe",
                mother: "Marie Doe"
            },
            diplomas: [
                {
                    school: "XYZ University",
                    year: 2020,
                    completed: true,
                    internship: {
                        hours: 290,
                        location: "XYZ Company"
                    }
                }
            ]
        },
        AddUser: {
            $name: "Jhon Doe",
            $age: 29,
            about: ""
        }
    }
}


swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    // require('./index.js')
})