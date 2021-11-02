exports.up = function (knex) {
  return knex.schema.createTable("products", function (table) {
    table.integer("code").primary();
    table.string("name").notNullable();
    table.float("original_price", 2);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("products");
};
