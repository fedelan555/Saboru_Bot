import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
    await m.react('⚘');

    if (!['owner', 'creator', 'creador', 'dueño'].includes(command.toLowerCase())) {
        return conn.sendMessage(m.chat, { text: `El comando ${command} no existe.` });
    }

    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let name = await conn.getName(who);
    let edtr = `@${m.sender.split('@')[0]}`;
    let username = await conn.getName(m.sender);

    // Info del dueño actualizada
    const ownerName = 'fede.xyz';
    const ownerNumber = '5491156178758';
    const ownerEmail = 'fedelanyt20@gmail.com';
    const ownerInstagram = 'nada';
    const ownerRegion = 'Argentina';

    // VCARD con datos actualizados
    let list = [{
        displayName: ownerName,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${ownerName}\n` +
            `item1.TEL;waid=${ownerNumber}:${ownerNumber}\n` +
            `item1.X-ABLabel:Número\n` +
            `item2.EMAIL;type=INTERNET:${ownerEmail}\n` +
            `item2.X-ABLabel:Email\n` +
            `item3.URL:${ownerInstagram}\n` +
            `item3.X-ABLabel:Instagram\n` +
            `item4.ADR:;; ${ownerRegion};;;;\n` +
            `item4.X-ABLabel:Región\nEND:VCARD`,
    }];

    const imageUrl = 'https://qu.ax/KdnAO.jpg';

    // Texto personalizado para el reply
    const dev = `Desarrollador: ${ownerName}`;
    const txt = `⚔ creador del bot: ${ownerName}\n📞 Número: +${ownerNumber}`;

    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: `${list.length} Contacto`,
            contacts: list
        },
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                title: 'һ᥆ᥣᥲ ᥴ᥆ᥒ𝗍ᥲᥴ𝗍᥆ ძᥱ mі ᥴrᥱᥲძ᥆r ⚔',
                body: dev,
                thumbnailUrl: imageUrl,
                sourceUrl: 'https://github.com/WillZek',
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });

    await conn.sendMessage(m.chat, { text: txt });
};

handler.help = ['owner', 'creator'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;
