import fs from 'fs';

let handler = async (m, { conn }) => {
  let txt = `👋🏻 MENU PARA USUARIOS PREM
🌙 *mediafire <link>*
🌙 *pin <txt>*
🌙 *spotify <txt>*
🌙 *gitclone <url>*
🌙 *tovideo*
🌙 *tourl <pfp>*
🌙 *githubsearch <url>*
🌙 *npmjs <txt>*
🌙 *tweetposts <txt>*
🌙 *infoanime*`.trim();

  let db = JSON.parse(fs.readFileSync('src/database/db.json', 'utf-8'));
  let videoUrl = db.links.video[0];

  await conn.sendMessage(m.chat, {
    video: { url: videoUrl },
    caption: txt,
    gifPlayback: true
  }, { quoted: m });

  m.react('✅');
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['main', 'menu', 'menuall', 'menucompleto'];
handler.register = true

export default handler;
