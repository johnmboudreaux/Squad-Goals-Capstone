/* eslint-disable */

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('squads', (table) => {
      table.increments('id').primary();
      table.string('squad_name');
      table.integer('conversation_id').unsigned();
      table.foreign('conversation_id').references('conversations.id');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('users_squads', (table) => {
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users.id').onDelete('cascade');
      table.integer('squad_id').unsigned();
      table.foreign('squad_id').references('squads.id').onDelete('cascade');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('users_goals', (table) => {
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users.id').onDelete('cascade');
      table.integer('goal_id').unsigned();
      table.foreign('goal_id').references('goals.id').onDelete('cascade');
      table.timestamps(true, true);
    }),
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users_goals'),
    knex.schema.dropTable('users_squads'),
    knex.schema.dropTable('squads'),
  ])
};
