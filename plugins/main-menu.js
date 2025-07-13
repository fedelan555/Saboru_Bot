import { promises} from 'fs'
import { join} from 'path'
import { xpRange} from '../lib/levelling.js'

let Styles = (text, style = 1) => {
  let xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
  let yStr = Object.freeze({
    1: '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵𝟬'
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
import { xpRange} from '../lib/levelling.js'

// Estilo de texto sobrio tipo Sae
const textSae = (text) => {
  const charset = {
    a: '𝗔', b: '𝗕', c: '𝗖', d: '𝗗', e: '𝗘', f: '𝗙', g: '𝗚',
    h: '𝗛', i: '𝗜', j: '𝗝', k: '𝗞', l: '𝗟', m: '𝗠', n: '𝗡',
    o: '𝗢', p: '𝗣', q: '𝗤', r: '𝗥', s: '𝗦', t: '𝗧', u: '𝗨',
    v: '𝗩', w: '𝗪', x: '𝗫', y: '𝗬', z: '𝗭'
}
  return text.toLowerCase().split('').map(c => charset[c] || c).join('')
}

// Etiquetas de comandos organizadas por categorías temáticas
let tags = {
  tecnica: textSae('Técnica de Pase'),
  vision: textSae('Lectura de Juego'),
  ego: textSae('Modo Ego'),
  control: textSae('Control Mental')
}

// Plantilla visual del menú
const defaultMenu = {
  before: `
🌌 𝗘𝗚𝗢 𝗣𝗥𝗢𝗙𝗨𝗡𝗗𝗢 — 𝗦𝗔𝗘 𝗜𝗧𝗢𝗦𝗛𝗜 🌌

🧠 Usuario: *%name*
⚡ Nivel mental: *%level*
🌐 Mundo: *%mode*
📉 EXP: %exp/%maxexp
🔮 Tiempo activo: %muptime

“𝗘𝗻 𝗹𝗮 𝗼𝘀𝗰𝘂𝗿𝗶𝗱𝗮𝗱 𝗲𝗹 𝘁𝗮𝗹𝗲𝗻𝘁𝗼 𝗿𝗲𝗮𝗹 𝗿𝗲𝘀𝗽𝗶𝗿𝗮.”%readmore`.trim(),

  header: '\n🧬 Núcleo: *%category*',
  body: '⚛ %cmd',
  footer: '━━━━━━━━━━━',
  after: '\n☄️ Desata tu genotipo de striker supremo.'
      }

let handler = async (m, { conn, usedPrefix: _p}) => {
  try {
    let { exp = 0, level = 0} = global.db.data.users[m.sender]
    let { min, xp} = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let _uptime = process.uptime() * 1000
    let muptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let mode = global.opts["self"]? "Privado 🔒": "Público 🌐"

    let help = Object.values(global.plugins).filter(p =>!p.disabled).map(p => ({
      help: Array.isArray(p.help)? p.help: [p.help],
      tags: Array.isArray(p.tags)? p.tags: [p.tags],
      prefix: 'customPrefix' in p,
      limit: p.limit,
      premium: p.premium,
      enabled:!p.disabled
}))

    for (let plugin of help) {
      for (let t of plugin.tags) {
        if (!(t in tags) && t) tags[t] = textSae(t)
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
.map(menu => menu.help.map(cmd => body.replace(/%cmd/g, menu.prefix? cmd: _p + cmd)).join('\n'))
.join('\n')
        return `${header.replace(/%category/g, tags[tag])}\n${cmds}\n${footer}`
}),
      after
    ].join('\n').replace(/%(\w+)/g, (_, key) => replace[key] || '')

    await conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/xapomp.jpg'}, // Imagen Blue Lock
      caption: menuText,
      buttons: [
        {
          buttonId: `${_p}modoego`,
          buttonText: { displayText: '🔥 ACTIVAR MODO EGO'},
          type: 1
}
      ],
      viewOnce: true
}, { quoted: m})

} catch (e) {
    console.error(e)
    conn.reply(m.chat, '❌ Error al generar el menú de Sae Itoshi.', m)
}
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']
handler.register = false

export default handler

function clockString(ms) {
  const h = isNaN(ms)? '--': Math.floor(ms / 3600000)
  const m = isNaN(ms)? '--': Math.floor(ms / 60000) % 60
  const s = isNaN(ms)? '--': Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
  }
