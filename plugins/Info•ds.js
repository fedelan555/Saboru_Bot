/* Codigo hecho por @Fabri115 y mejorado por BrunoSobrino */

import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync } from 'fs'
import path from 'path'

var handler = async (m, { conn, usedPrefix }) => {

if (global.conn.user.jid !== conn.user.jid) {
return conn.reply(m.chat, '👋🏻 *Utiliza este comando directamente en el número principal del Bot*', m, )
}

let chatId = m.isGroup ? [m.chat, m.sender] : [m.sender]
let sessionPath = `./${sessions}/`

try {

let files = await fs.readdir(sessionPath)
let filesDeleted = 0
for (let file of files) {
for (let id of chatId) {
if (file.includes(id.split('@')[0])) {
await fs.unlink(path.join(sessionPath, file))
filesDeleted++;
break
}}}

if (filesDeleted === 0) {
await conn.reply(m.chat, '✨ *No se encontró ningún archivo que incluya la ID del chat*', m, )
} else {
await conn.reply(m.chat, `🌙 *Se eliminaron ${filesDeleted} archivos de sesión*`, m, )
conn.reply(m.chat, `*Hola* 👋🏻`, m, )
}
} catch (err) {
console.error('Error al leer la carpeta o los archivos de sesión:', err)
await conn.reply(m.chat, '*Ocurrió un fallo*', m, )
}

}
handler.help = ['ds', 'fixmsgespera']
handler.tags = ['info']
handler.command = ['fixmsgespera', 'ds']

handler.register = false

export default handler
