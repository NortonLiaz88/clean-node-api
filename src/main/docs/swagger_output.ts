import { badRequest } from './components/bad-request'
import { forbidden } from './components/forbbiden'
import { notFound } from './components/notFound'
import { serverError } from './components/server-error'
import { unauthorized } from './components/unauthorized'
import { loginPath } from './paths/login-path'
import { suveysPath } from './paths/surveys-path'
import { accountSchema } from './schemas/account-id-schema'
import { apiKeyAuthSchema } from './schemas/api-key-auth-schema'
import { errorSchema } from './schemas/error-schema'
import { loginParamsSchema } from './schemas/login-params-schema'
import { surveySchema } from './schemas/survey-schema'
import { surveysSchema } from './schemas/surveys-schema'

export default {
  openapi: '3.0.0',
  info: {
    version: '2.1.0',
    title: 'Clean Node API',
    description: ''
  },
  license: {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT'
  },
  host: 'localhost:5050',
  basePath: '/',
  schemes: [
    'http'
  ],
  servers: [{
    url: '/api'
  }],
  tags: [
    { name: 'Login' }, { name: 'Survey' }
  ],
  paths: {
    '/signup': {
      post: {
        description: '',
        parameters: [],
        responses: {}
      }
    },
    '/login': loginPath,
    '/surveys': suveysPath,
    '/surveys/{surveyId}/results': {
      put: {
        description: '',
        parameters: [
          {
            name: 'surveyId',
            in: 'path',
            required: true,
            type: 'string'
          }
        ],
        responses: {}
      }
    }
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
    surveys: surveysSchema,
    survey: surveySchema,
    surveyAnswer: surveySchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    forbidden,
    serverError,
    unauthorized,
    notFound
  }
}
