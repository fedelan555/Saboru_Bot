let handler = async (m, { conn}) => {
  let name = await conn.getName(m.sender)
  let egoMsg = `
🔥 𝗠𝗢𝗗𝗢 𝗘𝗚𝗢 𝗔𝗖𝗧𝗜𝗩𝗔𝗗𝗢 🔥

👟 Usuario: *${name}*
📈 Estado mental: ✔️ Ajustado
⚽ Visualización: ✔️ 360° activada
💥 Técnica: ✔️ Precisión mejorada

“𝗧𝘂 𝗲𝗴𝗼 𝗱𝗲𝗰𝗶𝗱𝗲 𝗾𝘂𝗶𝗲́𝗻 𝗲𝗿𝗲𝘀. 𝗘𝘀 𝘁𝘂 𝘂́𝗻𝗶𝗰𝗮 𝗵𝗲𝗿𝗿𝗮𝗺𝗶𝗲𝗻𝘁𝗮.”

🌐 Estás entrenando al nivel *𝗦𝗔𝗘 𝗜𝗧𝗢𝗦𝗛𝗜*. No imites... domina.
  `.trim()

  await conn.sendMessage(m.chat, {
    image: { url: 'https://files.catbox.moe/jh0cu6.jpg'}, // Imagen estilo ego activo
    caption: egoMsg,
    buttons: [
      { buttonId: `.rankingstrikers`, buttonText: { displayText: '🥇 VER TOP STRIKERS'}, type: 1},
      { buttonId: `.vision360`, buttonText: { displayText: '👁️ ACTIVAR VISIÓN 360º'}, type: 1}
    ],
    viewOnce: true
}, { quoted: m})
}

handler.help = ['modoego']
handler.tags = ['ego']
handler.command = ['modoego']
handler.register = false

export default handler
