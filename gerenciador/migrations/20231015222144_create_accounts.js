exports.up = function(knex, Promise) {
    return knex.schema.createTable('accounts', (t)=>{
      t.increments('id').primary;
      t.string('name').notNull();
      t.integer('user_id').unsigned();
      t.foreign('user_id').references('users.id');
    })
  };
  
  exports.down = function(knex, Promise) {
      return knex.schema.dropTable('accounts'); 
  };