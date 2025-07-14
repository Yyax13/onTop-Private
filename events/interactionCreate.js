export default {
  name: 'interactionCreate',
  execute: async (interaction, ctx) => {
    if (!interaction.isButton()) return;

    const interactionHandler = ctx.interactions.get(interaction.customId);
    if (!interactionHandler) return;

    try {
      await interactionHandler.execute(interaction, ctx);
    } catch (err) {
      console.error('Error handling interaction:', err);
      if (!interaction.replied) {
        await interaction.reply({ content: 'Erro ao processar interação.', ephemeral: true });
      }
    }
  }
};
