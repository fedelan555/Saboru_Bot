let handler = async (m, { conn, isRowner }) => {
    const newCurrency = m.text.trim().split(' ').slice(1).join(' '); 

    if (!newCurrency) {
        return m.reply('*Proporciona una nueva moneda (por ejemplo, USD, EUR)*');
    }

    global.currency = newCurrency;

    m.reply(`*La moneda ha sido actualizada a: ${newCurrency}* ✨`);
};

handler.help = ['setcurrency']; 
handler.tags = ['banner'];
handler.command = ['setcurrency']; 
handler.mods = true

export default handler;
