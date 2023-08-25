const { PRODUCT_TABLE } = require('../models/product.model')

module.exports = {
    up: async (queryInterface) => {
      if(queryInterface.context){
        queryInterface = queryInterface.context;
    }
      return queryInterface.bulkInsert(PRODUCT_TABLE, [
      {
          name: 'Product 1',
          image: 'https://api.lorem.space/image/game?w=150&h=220',
          description: 'nlnana',
          price: 100,
          category_id: 1,
          created_at: new Date()
      },
      {
        name: 'Product 2',
          image: 'https://api.lorem.space/image/game?w=150&h=220',
          description: 'nln df ana',
          price: 1000,
          category_id: 1,
          created_at: new Date()
      },
      {
        name: 'Product 3',
          image: 'https://api.lorem.space/image/game?w=150&h=220',
          description: 'nlna fgdt na',
          price: 150,
          category_id: 2,
          created_at: new Date()
      },
      {
        name: 'Product 4',
          image: 'https://api.lorem.space/image/game?w=150&h=220',
          description: 'nlna fgdt na',
          price: 1500,
          category_id: 2,
          created_at: new Date()
      }
    ]);
    },
    down: (queryInterface) => {
      if(queryInterface.context){
        queryInterface = queryInterface.context;
    }
      return queryInterface.bulkDelete(PRODUCT_TABLE, null, {});
    }
  };