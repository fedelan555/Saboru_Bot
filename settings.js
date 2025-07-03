import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

global.botNumberCode = '' //Ejemplo: +5493876639332
global.confirmCode = ''

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.owner = [
   ['5491156178758', 'Fede', true],
   ['573019648280', 'fede', true],
]

global.mods = ['5491156178758', '573019648280']
global.prems = []

global.isBaileysFail = false
global.libreria = 'Baileys'
global.baileys = 'V 6.7.8'
global.vs = '1.0.1'
global.languaje = 'Español'
global.nameqr = '𝗍ᥲᥒȷіr᥆_ᥲᥣ'
global.sessions = 'BotSession'
global.jadi = 'JadiBot'

global.banner = 'https://files.catbox.moe/7z2ayh.jpg'
global.botname = 'ꜱᴛᴀʀʟɪɢʜᴛ ᴄʀᴇᴡ'
global.author = ' ᥆ᥕᥒᥱr ᥆𝖿 𝗍һᥱ ᑲ᥆𝗍 𝖿ᥱძᥱ'
global.dev = ' ᥆ᥕᥒᥱr ᥆𝖿 𝗍һᥱ ᑲ᥆𝗍 𝖿ᥱძᥱ'
global.currency = 'Yenes'
global.botStatus = true;
global.image = fs.readFileSync('./src/img/imagen.jpg')
global.avatar = fs.readFileSync('./src/img/avatar_contact.jpg')

global.repobot = 'https://github.com/federico130/tanjiro.git'
global.grupo = 'https://chat.whatsapp.com/Db2iUOFmASuDgVlLPU2tAd'
global.comu = 'https://chat.whatsapp.com/GgPP07cL54iL6C1lrwX0fz'
global.channel = 'https://whatsapp.com/channel/0029VbApe6jG8l5Nv43dsC2N'

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment        

global.multiplier = 69
global.maxwarn = '3'

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'settings.js'"))
  import(`${file}?update=${Date.now()}`)
})
