import express from 'express'
import { PlayorPaused, seek, SendUrl } from '../Controller/watchpartyController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const sendUrlRoute=express.Router()

sendUrlRoute.post('/sendUrl/:id/:senderid',authMiddleware,SendUrl)
sendUrlRoute.post('/play_pause/:id/::senderid',authMiddleware,PlayorPaused)
sendUrlRoute.post('/seek/:id/:senderid',authMiddleware,seek)


export default sendUrlRoute;


