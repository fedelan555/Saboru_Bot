let handler = async (m, { conn}) => {
  const name = await conn.getName(m.sender)

  const egoMsg = `
🔥 𝗠𝗢𝗗𝗢 𝗘𝗚𝗢 𝗔𝗖𝗧𝗜𝗩𝗔𝗗𝗢 🔥

👤 *${name}* ha desbloqueado su *𝗘𝗚𝗢 𝗘𝗟𝗜𝗧𝗘* y entrado al campo como un verdadero striker.

💠 Estado mental: *𝗣𝗘𝗥𝗙𝗘𝗖𝗧𝗢*
🎯 Precisión de disparo: *𝗔𝗨𝗚𝗠𝗘𝗡𝗧𝗔𝗗𝗔*
👁️ Lectura de juego: *𝗩𝗜𝗦𝗜𝗢𝗡 𝟯𝟲𝟬º*
📡 Genotipo activado: *𝗦𝗔𝗘 𝗜𝗧𝗢𝗦𝗛𝗜*
🏟️ Zona Blue Lock: *𝗣𝗔𝗦𝗘 𝗣𝗥𝗢𝗙𝗘𝗦𝗜𝗢𝗡𝗔𝗟*

🧠 _“El ego decide quién sobrevive y quién desaparece en el fútbol.”_

⚙️ Usa los comandos disponibles para demostrar que no eres parte de la estadística, sino la excepción.
  `.trim()

  await conn.sendMessage(m.chat, {
    image: { url: 'https://files.catbox.moe/jh0cu6.jpg'}, // Imagen estilo ego activo
    caption: egoMsg,
    buttons: [
      {
        buttonId: `.rankingstrikers`,
        buttonText: { displayText: '🏆 VER TOP STRIKERS'},
        type: 1
},
      {
        buttonId: `.vision360`,
        buttonText: { displayText: '👁️ ACTIVAR VISIÓN 360º'},
        type: 1
},
      {
        buttonId: `.retar @usuario`,
        buttonText: { displayText: '⚔️ RETAR JUGADOR'},
        type: 1
}
    ],
    viewOnce: true
}, { quoted: m})
}

handler.help = ['modoego']
handler.tags = ['ego', 'blue']
handler.command = ['modoego']
handler.register = false

export default handler
