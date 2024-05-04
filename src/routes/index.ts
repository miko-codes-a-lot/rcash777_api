import express, { Router } from 'express'

import authRoute from './auth.route'
import config from '../config/config'
import docsRoute from './swagger.route'
import healthCheck from './health-check.route'
import userRoute from './user.route'

const router = express.Router()

interface IRoute {
  path: string
  route: Router
}

const defaultIRoute: IRoute[] = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/health-check',
    route: healthCheck,
  },
]

const devIRoute: IRoute[] = [
  // IRoute available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
]

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route)
})

/* istanbul ignore next */
if (config.env === 'development') {
  devIRoute.forEach((route) => {
    router.use(route.path, route.route)
  })
}

export default router
