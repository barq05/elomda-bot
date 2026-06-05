require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events
} = require('discord.js');

const config = require('./config.json');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

// تحقق رول
function hasRole(member, roles) {
  return member.roles.cache.some(r => roles.includes(r.id));
}

client.on('ready', () => {
  console.log(`🔥 ${client.user.tag} شغال`);
});

client.on(Events.InteractionCreate, async interaction => {

  // ================= MAIN PANEL =================
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'panel') {

      const embed = new EmbedBuilder()
        .setTitle("👑 لوحة العمدة")
        .setDescription("اختار نوع اللوحة")
        .setColor("DarkRed");

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('admin').setLabel('🛡️ لوحة إدارية').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('sectors').setLabel('🏛️ القطاعات').setStyle(ButtonStyle.Primary)
      );

      return interaction.reply({ embeds: [embed], components: [row] });
    }
  }

  // ================= ADMIN PANEL =================
  if (interaction.isButton() && interaction.customId === 'admin') {

    const embed = new EmbedBuilder()
      .setTitle("🛡️ لوحة الإدارة")
      .setDescription("اختار الأمر")
      .setColor("Red");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ban').setLabel('🔨 بان').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('timeout').setLabel('⏳ تايم اوت').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('kick').setLabel('👢 طرد').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('role').setLabel('🎭 رولات').setStyle(ButtonStyle.Primary)
    );

    return interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }

  // ================= SECTORS LIST =================
  if (interaction.isButton() && interaction.customId === 'sectors') {

    const embed = new EmbedBuilder()
      .setTitle("🏛️ القطاعات")
      .setDescription("اختار القطاع")
      .setColor("Blue");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('police').setLabel('🚔 امن عام').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('customs').setLabel('🛃 امن منشأت').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('army').setLabel('🪖 حرس حدود').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('medic').setLabel('🏥 دفاع مدني').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('mechanic').setLabel('🔧 كراج').setStyle(ButtonStyle.Secondary)
    );

    return interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }

  // ================= SECTOR PANEL =================
  const sectors = {
    police: config.sectors.police,
    customs: config.sectors.customs,
    army: config.sectors.army,
    medic: config.sectors.medic,
    mechanic: config.sectors.mechanic
  };

  if (interaction.isButton() && sectors[interaction.customId]) {

    if (!hasRole(interaction.member, sectors[interaction.customId])) {
      return interaction.reply({ content: "❌ مش مسموح", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle("📋 لوحة القرارات")
      .setDescription("اختار القرار")
      .setColor("Green");

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('hire').setLabel('➕ توظيف').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('fire').setLabel('❌ فصل').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('promote').setLabel('⬆️ ترقية').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('demote').setLabel('⬇️ تنزيل').setStyle(ButtonStyle.Secondary)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('reward').setLabel('💰 مكافأة').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('fine').setLabel('💸 غرامة').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('legal').setLabel('⚖️ قانوني').setStyle(ButtonStyle.Primary)
    );

    return interaction.reply({ embeds: [embed], components: [row1, row2], ephemeral: true });
  }

  // ================= ACTIONS =================
  const actions = {
    ban: "🔨 استخدم أمر البان",
    timeout: "⏳ استخدم أمر التايم اوت",
    kick: "👢 استخدم أمر الطرد",
    role: "🎭 استخدم أوامر الرولات",

    hire: "تم توظيف شخص",
    fire: "تم فصل شخص",
    promote: "تم ترقية شخص",
    demote: "تم تنزيل رتبة",
    reward: "تم إعطاء مكافأة",
    fine: "تم إعطاء غرامة",
    legal: "قرار قانوني"
  };

  if (interaction.isButton() && actions[interaction.customId]) {
    return interaction.reply({
      content: `✅ ${actions[interaction.customId]}`,
      ephemeral: true
    });
  }

});

client.login(process.env.TOKEN);