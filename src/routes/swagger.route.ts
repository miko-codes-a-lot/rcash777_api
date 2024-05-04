import express from 'express'
import swaggerDefinition from '../modules/swagger/swagger.definition'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const router = express.Router()

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ['packages/components.yaml', 'dist/routes/v1/*.js'],
})

router.use('/', swaggerUi.serve)
router.get(
  '/',
  swaggerUi.setup(specs, {
    explorer: true,
  }),
)

export default router
