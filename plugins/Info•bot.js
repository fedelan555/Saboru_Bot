import fs from 'fs';
const handler = (m) => m;
handler.all = async function(m) {

const chat = global.db.data.chats[m.chat];
if (chat.isBaneed) return
if (/^bot$/i.test(m.text)) {
conn.reply(m.chat, `Hola, 👋🏻 para ver los comandos del bot utiliza \n.menu`, m, )
}

if (/^Hola bot$/i.test(m.text)) {
conn.reply(m.chat, `Hola 👋🏻 soy ${botname}\nutiliza .menu\nPara ver mis comandos`, m, )
}
return !0;
};
export default handler;
