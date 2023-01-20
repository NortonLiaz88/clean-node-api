const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/main/routes/login-routes.ts', './src/main/routes/survey-routes.ts', './src/main/routes/save-survey-result.ts']

swaggerAutogen(outputFile, endpointsFiles)
