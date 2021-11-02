exports.up = function (knex) {
  return knex.schema.createTable("units", function (table) {
    table.increments("id").primary();
    table.integer("product_id").notNullable().references("products.code");
    table.boolean("sold");
    table.integer("purchase_price").notNullable();
    table.integer("sale_price");
    table.timestamp("sale_date");
    table.integer("client_id").notNullable().references("clients.id");
    table.integer("category_id").notNullable().references("categories.id");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("units");
};
