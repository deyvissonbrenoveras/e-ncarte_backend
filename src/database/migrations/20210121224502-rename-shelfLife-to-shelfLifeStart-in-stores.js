module.exports = {
  up: async (queryInterface) => {
    await queryInterface.renameColumn('Stores', 'shelfLife', 'shelfLifeEnd');
  },

  down: async (queryInterface) => {
    await queryInterface.renameColumn('Stores', 'shelfLifeEnd', 'shelfLife');
  },
};
