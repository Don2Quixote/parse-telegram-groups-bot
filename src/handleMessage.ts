import * as fs from 'fs'
import * as fetch from 'node-fetch'

import { TelegrafContext } from 'telegraf/typings/context'
import { InputFile } from 'telegraf/typings/telegram-types'

import { Group } from './types'

const getUsers = (): string[] => JSON.parse(fs.readFileSync('users.json', 'utf8'))
const saveUsers = (users: string[]) => fs.writeFileSync('users.json', JSON.stringify(users))

const getGroups = (): Group[] => JSON.parse(fs.readFileSync('groups.json', 'utf8'))
const saveGroups = (groups: Group[]) => fs.writeFileSync('groups.json', JSON.stringify(groups))

const restoreGroups = (): Group[] => JSON.parse(fs.readFileSync('restore.json', 'utf8'));

const langs = [
    'uz', 'ru', 'en', 'tr', 'es', 
    'pt', 'it', 'id', 'vi', 'zh',
    'hi', 'de', 'fa', 'ko', 'ar',
    'uk', 'az', 'tg', 'fr', 'ky',
    'ms', 'nl', 'fil', 'ja', 'ml',
    'iw', 'bn', 'pl', 'kk', 'ig',
    'am', 'te', 'so'
]

const generateGroupsListToSend = (groups: Group[]): InputFile => {
    let result: string = ''
    for (let g in groups) {
        result += `${+g + 1}. @${groups[g].u} - ${groups[g].t}\n`
    }
    return {
        source: Buffer.from(result),
        filename: groups.length.toString() + '.txt'
    }
}

const generateUsernamesListToSend = (groups: Group[]): InputFile => {
    let result: string = ''
    for (let group of groups) {
        result += '@' + group.u + '\n'
    }
    return {
        source: Buffer.from(result),
        filename: groups.length.toString() + '.txt'
    }
}

const parseGroups = async (): Promise<Group[]> => {
    try {
        let req = await fetch('https://combot.org/telegram/top/groups?lng=all&page=3')
        let html = await req.text()
        let splitted = html.split('\n')
        let lineInHtmlDocument = splitted.find(line => line.includes('var topchats'))
        let groups = lineInHtmlDocument.slice(15, lineInHtmlDocument.length - 1)
        return JSON.parse(groups)
    } catch (e) {
        console.log(e)
        return null
    }
}

export default async (ctx: TelegrafContext): Promise<void> => {
    if (!ctx.message.text) return
    let [command, ...args] = ctx.message.text.split(' ')
    console.log(command, args);

    let groups: Group[] = getGroups()
    if (command == '/get') {
        if (!args.length || args[0] == 'all') {
            let result: string = ''
            await ctx.replyWithDocument(generateGroupsListToSend(groups))
        } else {
            let lang: string = ''
            if (langs.includes(args[args.length - 1].toLowerCase())) {
                lang = args[args.length - 1]
                args = args.slice(0, args.length - 1)
            }
            groups = groups.filter(g => (g.t.includes(args.join(' ')) || g.u.includes(args.join(' '))) && (lang ? g.l.toLowerCase() == lang.toLowerCase() : true))
            await ctx.replyWithDocument(generateGroupsListToSend(groups))
        }
    } else if (command.toLowerCase() == '/getusernames') {
        if (!args.length || args[0] == 'all') {
            let result: string = ''
            await ctx.replyWithDocument(generateUsernamesListToSend(groups))
        } else {
            let lang: string = ''
            if (langs.includes(args[args.length - 1].toLowerCase())) {
                lang = args[args.length - 1]
                args = args.slice(0, args.length - 1)
            }
            groups = groups.filter(g => (g.t.includes(args.join(' ')) || g.u.includes(args.join(' '))) && (lang ? g.l.toLowerCase() == lang.toLowerCase() : true))
            await ctx.replyWithDocument(generateUsernamesListToSend(groups))
        }
    } else if (command == '/update') {
        groups = await parseGroups()
        if (groups) {
            saveGroups(groups)
            await ctx.replyWithDocument(generateGroupsListToSend(groups)) 
        } else {
            await ctx.reply('❌ Произошла ошибка во время обновления базы')
        }
    } else if (command == '/restore') {
        groups = restoreGroups()
        saveGroups(groups)
        await ctx.replyWithDocument(generateGroupsListToSend(groups))
    } else if (command.toLowerCase() == '/adduser') {
        if (!args.length) {
            ctx.reply('❌ Вы не указали username пользователя')
        } else {
            let users: string[] = getUsers();
            if (users.includes(args[0])) {
                await ctx.reply('❌ Этот пользователь уже добавлен')
            } else {
                users.push(args[0])
                saveUsers(users)
                await ctx.reply('✅ Пользователь добавлен')
            }
        }
    } else if (command.toLowerCase() == '/removeuser') {
        if (!args.length) {
            ctx.reply('❌ Вы не указали username пользователя')
        } else {
            let users: string[] = getUsers()
            if (!users.includes(args[0])) {
                await ctx.reply('❌ Этот пользователь не был добавлен ранее')
            } else {
                users = users.filter(u => u.toLowerCase() != args[0].toLowerCase())
                saveUsers(users)
                await ctx.reply('✅ Пользователь удалён')
            }
        }
    } else if (command.toLowerCase() == '/listusers') {
        let users: string[] = getUsers()
        let reply_text: string = '';
        if (users.length) {
            for (let u in users) {
                reply_text += `${+u + 1}. @${users[u]}\n`
            }
        } else {
            reply_text = '❌ Нет пользователей' 
        }
        await ctx.reply(reply_text);
    }
}

