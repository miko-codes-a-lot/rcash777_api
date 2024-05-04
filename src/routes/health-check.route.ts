import express, { Router } from 'express'

const router: Router = express.Router()

router.get('/', (_, res) => {
  return res.status(200).json({ status: 'Ok!' })
})

export default router
