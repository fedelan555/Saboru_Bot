import { xpRange} from '../lib/levelling.js'

const textSae = (text) => {
  const charset = {
    a: '𝗔', b: '𝗕', c: '𝗖', d: '𝗗', e: '𝗘', f: '𝗙', g: '𝗚',
    h: '𝗛', i: '𝗜', j: '𝗝', k: '𝗞', l: '𝗟', m: '𝗠', n: '𝗡',
    o: '𝗢', p: '𝗣', q: '𝗤', r: '𝗥', s: '𝗦', t: '𝗧', u: '𝗨',
    v: '𝗩', w: '𝗪', x: '𝗫', y: '𝗬', z: '𝗭'
}
  return text.toLowerCase().split('').map(c => charset[c] || c).join('')
}

let tags = {
  tecnica: textSae('Técnica de Pase'),
  vision: textSae('Lectura de Juego'),
  ego: textSae('Modo Ego'),
  control: textSae('Control Mental')
}

const defaultMenu = {
  before: `
⚽︵‿︵‿︵‿︵‿︵
╭━━━ 𝗦𝗔𝗘 𝗜𝗧𝗢𝗦𝗛𝗜 𝗕𝗢𝗧 ━╮
┃ 𝗠𝗘𝗡𝗨 𝗗𝗘 𝗘𝗚𝗢 𝗘𝗟𝗜𝗧𝗘 ┃
╰━━━━━━━━━━━━╯

👟 Usuario: *%name*
🎖️ Nivel: *%level*
📊 EXP: %exp/%maxexp
📡 Modo: %mode
🧠 Registro global: %totalreg
⏱️ Tiempo activo: %muptime

“𝗟𝗮 𝗲𝗹𝗶𝘁𝗲 𝗻𝗼 𝗽𝗶𝗲𝗻𝘀𝗮, 𝗲𝗷𝗲𝗰𝘂𝘁𝗮.”%readmore`.trim(),

  header: '\n⚙️ Sección: *%category*',
  body: '🔹 %cmd',
  footer: '────────────────────',
  after: '\n⚽ Usa los comandos como un profesional.'
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
      enabled:!p.disabled,
}))

    for (let plugin of help) {
      for (let t of plugin.tags) {
        if (!(t in tags) && t) tags[t] = textSae(t)
}
}

    const { before, header, body, footer, after} = defaultMenu

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
    ].join('\n')

    let replace = {
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

    let finalText = menuText.replace(/%(\w+)/g, (_, key) => replace[key] || '')

    await conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/xapomp.jpg'}, // Imagen tipo Blue Lock
      caption: finalText,
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
