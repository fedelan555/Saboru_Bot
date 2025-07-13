import { promises} from 'fs'
import { join} from 'path'
import { xpRange} from '../lib/levelling.js'

let Styles = (text, style = 1) => {
  let xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
  let yStr = Object.freeze({
    1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890'
});
  let replacer = [];
  xStr.forEach((v, i) => replacer.push({
    original: v,
    convert: yStr[style].split('')[i]
}));
  return text
.toLowerCase()
.split('')
.map(v => (replacer.find(x => x.original === v) || { convert: v}).convert)
.join('');
};

let tags = {
  tecnica: Styles('Técnica de Pase'),
  vision: Styles('Lectura de Juego'),
  ego: Styles('Modo Ego'),
  control: Styles('Control Mental'),
  grupal: Styles('Estrategia grupal'),
  system: Styles('Estado del Bot'),
  fun: Styles('Diversión'),
  herramientas: Styles('Herramientas útiles'),
}

const defaultMenu = {
  before: `
⚽━ 𝗘𝗚𝗢 𝗣𝗥𝗢𝗙𝗘𝗦𝗜𝗢𝗡𝗔𝗟 — 𝗦𝗔𝗘 𝗜𝗧𝗢𝗦𝗛𝗜 ━⚽

👟 Usuario: *%name*
📈 Nivel: *%level*
📊 EXP: %exp/%maxexp
📡 Modo: *%mode*
🧠 Jugadores registrados: %totalreg
⏱️ Tiempo activo: *%muptime*

“Los verdaderos jugadores no sueñan con destacar. Ellos destacan por cómo juegan.”%readmore`.trim(),

  header: '\n📂 Sección: *%category*',
  body: '🔹 %cmd',
  footer: '━━━━━━━━━━━━━',
  after: '\n⚙️ Usa tu talento, no tus excusas.'
}

let handler = async (m, { conn, usedPrefix: _p, __dirname}) => {
  try {
    const { exp, level} = global.db.data.users[m.sender]
    const { min, xp, max} = xpRange(level, global.multiplier)
    const name = await conn.getName(m.sender)
    const _uptime = process.uptime() * 1000
    const muptime = clockString(_uptime)
    const mode = global.opts.self? 'Privado 🔒': 'Público 🌐'
    const totalreg = Object.keys(global.db.data.users).length

    const help = Object.values(global.plugins)
.filter(plugin =>!plugin.disabled)
.map(plugin => ({
        help: Array.isArray(plugin.help)? plugin.help: [plugin.help],
        tags: Array.isArray(plugin.tags)? plugin.tags: [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled:!plugin.disabled
}));

    for (let plugin of help) {
      for (let t of plugin.tags) {
        if (!(t in tags) && t) tags[t] = Styles(t)
}
}

    const { before, header, body, footer, after} = defaultMenu
    const replace = {
      '%': '%',
      name,
      level,
      exp: exp - min,
      maxexp: xp,
      totalreg,
      mode,
      muptime,
      readmore: String.fromCharCode(8206).repeat(4001)
}

    let menuText = [
      before,
...Object.keys(tags).map(tag => {
        const cmds = help
.filter(menu => menu.tags.includes(tag))
.map(menu => menu.help.map(cmd =>
            body.replace(/%cmd/g, menu.prefix? cmd: _p + cmd)).join('\n'))
.join('\n')
        return `${header.replace(/%category/g, tags[tag])}\n${cmds}\n${footer}`
}),
      after
    ].join('\n').replace(/%(\w+)/g, (_, key) => replace[key] || '')

    await m.react('⚽️')

    await conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/xapomp.jpg'},
      caption: menuText,
      buttons: [
        { buttonId: `${_p}modoego`, buttonText: { displayText: '🔥 Activar Modo Ego'}, type: 1},
        { buttonId: `${_p}vision360`, buttonText: { displayText: '👁️ Visión 360º'}, type: 1},
        { buttonId: `${_p}rankingstrikers`, buttonText: { displayText: '🥇 Ver Ranking'}, type: 1}
      ],
      footer: '𝗕𝗹𝘂𝗲 𝗟𝗼𝗰𝗸 𝗦𝘆𝘀𝘁𝗲𝗺 — 𝗦𝗮𝗲 𝗕𝗼𝘁',
      viewOnce: true
}, { quoted: m})

} catch (e) {
    console.error(e)
    conn.reply(m.chat, '❎ Error al generar el menú Blue Lock.', m)
}
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help', 'menublue']
handler.register = false

export default handler

function clockString(ms) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor(ms / 60000) % 60
  const s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}
