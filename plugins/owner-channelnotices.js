import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const canalJid = '120363420017244077@newsletter';
 // const icono = 'https://i.imgur.com/4M34hi2.jpeg';
  const redes = global.redes || 'https://whatsapp.com/channel/0029VbApe6jG8l5Nv43dsC2N';
  const dev = '⚔ TANJIRO BOT NOTIFICACIÓN';

  const isMedia = m.quoted?.mimetype || m.quoted?.mediaType;

  try {
    if (m.quoted && isMedia) {
      const media = await m.quoted.download();
      const mimetype = m.quoted?.mimetype;
      const type = mimetype.startsWith('image') ? 'image'
                  : mimetype.startsWith('video') ? 'video'
                  : mimetype.startsWith('audio') ? 'audio'
                  : mimetype === 'image/webp' ? 'sticker'
                  : null;

      if (!type) return m.reply('❌ Tipo de archivo no soportado para enviar al canal.');

      await conn.sendMessage(canalJid, {
        [type]: media,
        mimetype,
        caption: type !== 'sticker' ? (text || '📢 𝐀𝐕𝐈𝐒𝐎 𝐈𝐌𝐏𝐎𝐑𝐓𝐀𝐍𝐓𝐄 ⚔') : undefined,
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            serverMessageId: 100
          },
          externalAdReply: {
            title: '📢 𝐀𝐕𝐈𝐒𝐎 𝐈𝐌𝐏𝐎𝐑𝐓𝐀𝐍𝐓𝐄 ⚔',
            body: dev,
            mediaUrl: null,
            description: null,
            previewType: "PHOTO",
            thumbnailUrl: icono,
            sourceUrl: redes,
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: true
          }
        }
      }, { quoted: m });

      await m.reply('✅ Aviso multimedia enviado al canal.');
    } else {
      if (!text) {
        return m.reply(`⚠️ Escribe el texto que quieres enviar al canal, o etiqueta un archivo.\n\nEjemplo:\n${usedPrefix + command} ¡Atención! Mantenimiento programado esta noche. 🌙`);
      }

      const mensaje = `> *AVISO ENVIADO CHANNEL 🔔*\n\n${text}`;

      await conn.sendMessage(canalJid, {
        text: mensaje,
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            serverMessageId: 100
          },
          externalAdReply: {
            title: '📢 𝐀𝐕𝐈𝐒𝐎 𝐈𝐌𝐏𝐎𝐑𝐓𝐀𝐍𝐓𝐄 ⚔',
            body: dev,
            mediaUrl: null,
            description: null,
            previewType: "PHOTO",
            thumbnailUrl: icono,
            sourceUrl: redes,
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: true
          }
        }
      });

      await m.reply('✅ Aviso de texto enviado correctamente al canal.');
    }
  } catch (e) {
    console.error(e);
    await m.reply('❌ Error al enviar el aviso. Asegúrate de que el bot esté en el canal como administrador.');
  }
};

handler.help = ['aviso <texto>'];
handler.tags = ['owner'];
handler.command = ['aviso'];
handler.rowner = true;

export default handler;
