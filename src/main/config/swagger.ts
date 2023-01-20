import { serve, setup } from 'swagger-ui-express'
import { Express } from 'express'
import { noCache } from '../middlewares/no-cache'
import swaggerFile from '../docs/swagger_output'
// eslint-disable-next-line @typescript-eslint/no-var-requires

export default (app: Express): void => {
  app.use('/api-docs', noCache, serve, setup(swaggerFile))
}
