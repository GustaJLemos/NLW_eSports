import { PrismaClient } from "@prisma/client"
import express from "express"
import { convertHourStringToMinutes } from "./utils/convert-hour-string-to-minutes"
import { convertMinutesToHourString } from "./utils/convert-minutes-to-hours-string"
import cors from 'cors'

const app = express()

// por padrão o express n entende json, então eu preciso permitir pra ele, q ele entenda json
// fazemos isso para que o express entenda q a gente quer enviar dele uma informação json
app.use(express.json())

// se eu passo só cors, todos os fronts vão conseguir acessar o meu bacn-end
// o origin é esse cara que vai permitir apenas requisições daquele domínio acessarem o seu back-end
app.use(cors({
  origin: 'http://localhost:3333'
}))

// esse prismaClient vai fazer a conexão com o banco pra gente automaticamente
const prisma = new PrismaClient({
  log: ['query']
})

// primiero parâmetro é o endereço que o usuário deve digitar para cair nesse endpoint
// como por ex: www.minhaApi.com/ads

// localhost:3333/ads

app.get('/games', async (request, response) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true
        }
      }
    }
  })

  return response.json(games)
})

app.post('/games/:gameId/ads', async (request, response) => {
  const gameId = request.params.gameId;
  const body = request.body;

  const convertedHourStart = convertHourStringToMinutes(body.hourStart);
  const convertedHourEnd = convertHourStringToMinutes(body.hourEnd);

  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearPlaying: body.yearPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(','),
      hourStart: convertedHourStart,
      hourEnd: convertedHourEnd,
      useVoiceChannel: body.useVoiceChannel
    }
  })

  return response.json(ad);
})

app.get('/games/:id/ads', async (request, response) => {
  const gameId: any = request.params.id

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearPlaying: true,
      hourStart: true,
      hourEnd: true,
      createdAt: true,
    },
    where: {
      gameId: gameId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return response.json(ads.map(ad => {
    return {
      ...ad,
      weekDays: ad.weekDays.split(','),
      hourStart: convertMinutesToHourString(ad.hourStart),
      hourEnd: convertMinutesToHourString(ad.hourEnd)
    }
  }))
})

app.get('/ads/:id/discord', async (request, response) => {
  const adId = request.params.id

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id: adId
    }
  })

  return response.json(ad)
})

// quando uso o listen falo para q a minha aplicação fique ouvindo novas requisições,
// e não pare, a menos que o usuário peça que pare

app.listen(3333)