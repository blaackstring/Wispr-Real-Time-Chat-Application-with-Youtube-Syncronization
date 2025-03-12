import express from 'express'
import { PlayorPaused, seek, SendUrl } from '../Controller/watchpartyController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const sendUrlRoute=express.Router()

sendUrlRoute.post('/sendUrl/:id',authMiddleware,SendUrl)
sendUrlRoute.post('/play_pause/:id',authMiddleware,PlayorPaused)
sendUrlRoute.post('/seek/:id',authMiddleware,seek)


export default sendUrlRoute;


