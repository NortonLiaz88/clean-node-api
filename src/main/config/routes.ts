import { Express } from 'express'
import fg from 'fast-glob'

export default (app: Express): void => {
  fg.sync('**/src/main/**routes.ts')
}
