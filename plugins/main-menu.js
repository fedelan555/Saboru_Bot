import { promises} from 'fs'
import { join} from 'path'
import { xpRange} from '../lib/levelling.js'

// Estilo tipográfico oscuro
let Styles = (text, style = 1) => {
  let xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
  let yStr = Object.freeze({
    1: '𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟1234567890'
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

// Categorías con nombres místicos
let tags = {
  return: Styles('Regreso por Muerte'),
  willpower: Styles('Voluntad Inquebrantable'),
  timeline: Styles('Línea Temporal'),
  support: Styles('Aliados'),
  vision: Styles('Lectura de Camino'),
  tools: Styles('Herramientas del Destino'),
  system: Styles('Sistema Interno'),
  fun: Styles('Interludio')
};

// Estructura textual del menú
const defaultMenu = {
  before: `
🌌━━━ 𝗦𝗨𝗕𝗔𝗥𝗨𝗕𝗢𝗧 𝗩𝟮.𝟬 ━━━🌌

🕯️ Usuario: *%name*
📶 Nivel: *%level*
📜 EXP: %exp/%maxexp
🧬 Registros activos: %totalreg
🔄 Modo actual: *%mode*
🕰️ Activo desde: *%muptime*

"El dolor no es un castigo. Es una guía que nos lleva a mejorar."%readmore`.trim(),

  header: '\n🎭 Módulo: *%category*',
  body: '🔸 %cmd',
  footer: '─────────────',
  after: '\n🔁 Sigue adelante... aunque el mundo se repita.'
};

// Handler principal del menú
let handler = async (m, { conn, usedPrefix: _p, __dirname}) => {
  try {
    const { exp, level} = global.db.data.users[m.sender];
    const { min, xp, max} = xpRange(level, global.multiplier);
    const name = await conn.getName(m.sender);
    const _uptime = process.uptime() * 1000;
    const muptime = clockString(_uptime);
    const mode = global.opts.self? 'Privado 🔒': 'Público 🌐';
    const totalreg = Object.keys(global.db.data.users).length;

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
        if (!(t in tags) && t) tags[t] = Styles(t);
}
}

    const { before, header, body, footer, after} = defaultMenu;
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
};

    let menuText = [
      before,
...Object.keys(tags).map(tag => {
        const cmds = help
.filter(menu => menu.tags.includes(tag))
.map(menu => menu.help.map(cmd =>
            body.replace(/%cmd/g, menu.prefix? cmd: _p + cmd)).join('\n'))
.join('\n');
        return `${header.replace(/%category/g, tags[tag])}\n${cmds}\n${footer}`;
}),
      after
    ].join('\n').replace(/%(\w+)/g, (_, key) => replace[key] || '');

    await m.react('🕯️');

    await conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/44qt5t.jpg'},
      caption: menuText,
      buttons: [
        { buttonId: `${_p}Reg Subaru.13`, buttonText: { displayText: '🔓 REINICIAR DESTINO'}, type: 1},
        { buttonId: `${_p}code`, buttonText: { displayText: '📜 CÓDIGO DEL MUNDO'}, type: 1},
        { buttonId: `${_p}owner`, buttonText: { displayText: '🕯️ EL COMIENZO'}, type: 1}
      ],
      footer: '𝗦𝘂𝗯𝗮𝗿𝘂𝗕𝗼𝘁 𝗩𝟮.𝟬 — 𝗥𝗲𝗶𝗻𝗶𝗰𝗶𝗼 𝗘𝘁𝗲𝗿𝗻𝗼',
      viewOnce: true
}, { quoted: m});
} catch (e) {
    console.error(e);
    conn.reply(m.chat, '❌ Error al ejecutar el menú Subaru.', m);
}
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'help', 'menú'];
handler.register = false;

export default handler;

function clockString(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}
