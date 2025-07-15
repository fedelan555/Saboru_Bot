import { execSync } from 'child_process'
let handler = async (m, { conn, text }) => {

try {
await m.react(rwait)
if (conn.user.jid == conn.user.jid) {
let stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : ''))
await conn.reply(m.chat, stdout.toString(), m, rcanal)
await m.react(done)}
} catch (e) {
await m.react(error)
await m.reply('⚔ Se actualizo exitosamente...')
}}

handler.help = ['update', 'actualizar', 'up']
handler.tags = ['owner']
handler.command = ['update', 'actualizar', 'up']
handler.rowner = true

export default handler
