import swaggerJsdoc from 'swagger-jsdoc'

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Trust',
        version: '1.0.0',
        description: 'API documentation for Trust project'
    },
    server: [
        {
            url: 'http://localhost:8080',
            description: 'Development Server'
        },
    ],
};

const option = {
    swaggerDefinition,
    apis: ['./src/rotes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(option)

export default swaggerSpec;