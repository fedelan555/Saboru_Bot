let handler = async (m, { conn, text}) => {
let who
if (m.isGroup) who = m.mentionedJid[0]
else who = m.chat
let users = global.db.data.users
users[who].banned = true
conn.reply(m.chat, `🍃 *El usuario @${who.split('@')[0]} Fue baneado*`, fkontak, { mentions: [who]})
}
handler.help = ['banuser <@tag> <razón>']
handler.command = ['banuser']
handler.tags = ['owner']
handler.rowner = true
export default handler
