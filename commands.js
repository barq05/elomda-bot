require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [

  new SlashCommandBuilder()
    .setName('panel')
    .setDescription('فتح لوحة التحكم'),

  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('حظر عضو')
    .addUserOption(o =>
      o.setName('user')
        .setDescription('الشخص')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('تايم اوت عضو')
    .addUserOption(o =>
      o.setName('user')
        .setDescription('الشخص')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('kick')
    .setDescription('طرد عضو')
    .addUserOption(o =>
      o.setName('user')
        .setDescription('الشخص')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('إضافة رول')
    .addUserOption(o =>
      o.setName('user')
        .setDescription('الشخص')
        .setRequired(true)
    )
    .addRoleOption(o =>
      o.setName('role')
        .setDescription('الرول')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('removerole')
    .setDescription('حذف رول')
    .addUserOption(o =>
      o.setName('user')
        .setDescription('الشخص')
        .setRequired(true)
    )
    .addRoleOption(o =>
      o.setName('role')
        .setDescription('الرول')
        .setRequired(true)
    )

].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("⏳ جاري تسجيل الأوامر...");
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log("✅ تم تسجيل الأوامر");
  } catch (err) {
    console.error(err);
  }
})();