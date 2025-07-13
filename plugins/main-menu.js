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

// Etiquetas personalizadas
let tags = {
  tecnica: textSae('Técnica de Pase'),
  vision: textSae('Lectura de Juego'),
  pro: textSae('Modo Profesional'),
  mental: textSae('Control Mental')
}

// Plantilla base de menú
const defaultMenu = {
  before: `
⚽ 𝗦𝗔𝗘 𝗜𝗧𝗢𝗦𝗛𝗜 - 𝗠𝗘𝗡𝗨 𝗠𝗔𝗘𝗦𝗧𝗥𝗢 𝗗𝗘 𝗝𝗨𝗘𝗚𝗢 ⚽

👟 Usuario: *%name*
🎯 Ranking: *%rank*
📊 Nivel: *%level*
⏱️ Tiempo activo: *%muptime*

🧠 “No hay talento sin mentalidad. Tu ego decide si llegas al nivel mundial.”%readmore`.trim(),

  header: '\n🎯 Categoría: *%category*',
  body: '➤ %cmd',
  footer: '──────────────',
  after: '\n👟 Usa los comandos con precisión.'
}

// Función para mostrar tiempo activo
function clockString(ms) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor(ms / 60000) % 60
  const s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

// Handler principal del comando menú
let handler = async (m, { conn, usedPrefix: _p}) => {
  try {
    const { exp = 0, level = 0} = global.db.data.users[m.sender]
    const { min, xp} = xpRange(level, global.multiplier)
    const name = await conn.getName(m.sender)
    const _uptime = process.uptime() * 1000
    const muptime = clockString(_uptime)
    const rank = level> 30? '𝐄𝐥𝐢𝐭𝐞 🥇': level> 10? '𝐈𝐧𝐭𝐞𝐧𝐬𝐢𝐯𝐨 🥈': '𝐍𝐨𝐯𝐚𝐭𝐨 🥉'

    let help = Object.values(global.plugins).filter(p =>!p.disabled).map(p => ({
      help: Array.isArray(p.help)? p.help: [p.help],
      tags: Array.isArray(p.tags)? p.tags: [p.tags],
      prefix: 'customPrefix' in p,
      limit: p.limit,
      premium: p.premium,
      enabled:!p.disabled
}))

    for (let plugin of help) {
      for (let tag of plugin.tags) {
        if (tag &&!(tag in tags)) tags[tag] = textSae(tag)
}
}

    const { before, header, body, footer, after} = defaultMenu
    const replace = {
      '%': '%',
      name,
      rank,
      level,
      exp: exp - min,
      maxexp: xp,
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
      image: { url: 'https://files.catbox.moe/uhj3qp.jpg'}, // Imagen tipo Blue Lock
      caption: menuText,
      buttons: [
        {
          buttonId: `${_p}rankingglobal`,
          buttonText: { displayText: '📊 Ver Ranking'},
          type: 1
}
      ],
      viewOnce: true
}, { quoted: m})

} catch (e) {
    console.error(e)
    conn.reply(m.chat, '❌ Error al cargar el menú de Sae.', m)
}
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']
handler.register = false

export default handler
