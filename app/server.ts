import 'reflect-metadata'
import './path'
import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { config } from 'dotenv'
import { routes } from '~/routes'
import { checkEnvVariables } from '@/config/constants/env'
import { cityAirQualityJob } from '@/core/jobs/city-ari-quality.job'

config()

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use('/static', express.static('public'))
checkEnvVariables()

app.get('/', async (req: Request, res: Response) => {
  res.send('here')
})

routes(app)

const PORT = process.env.PORT || 3000

async function startServer() {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`)

    // Start the air quality CRON job
    try {
      cityAirQualityJob.start()
    } catch (error) {
      console.error('❌ Failed to start air quality CRON service:', error)
    }
  })
}

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error)
  process.exit(1)
})
