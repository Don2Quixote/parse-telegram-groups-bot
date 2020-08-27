import * as path from 'path'
process.chdir(path.dirname(process.argv[1]))

import * as dotenv from 'dotenv'
dotenv.config()
const TOKEN = process.env.TOKEN.toString()
const ADMIN_ID = parseInt(process.env.ADMIN_ID)

import * as fs from 'fs'
import Telegraf from 'telegraf'

import { TelegrafContext } from 'telegraf/typings/context'
import { Group } from './types'

const bot = new Telegraf(TOKEN)

const getUsers = () => JSON.parse(fs.readFileSync('users.json', 'utf8'))

import handleMessage from './handleMessage'
bot.on('message', async (ctx: TelegrafContext) => {
    if (ctx.from.id == ADMIN_ID || getUsers().includes(ctx.from.username)) {
        try {
            await handleMessage(ctx)
        } catch (e) {
            console.log(e)
        }
    }
})

bot.launch()
