/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  return knex("roles").then(function () {
    // Inserts seed entries
    return knex("roles").insert([
      {
        role: "administrator",
        pattern: "/administrator",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: "super admin",
        pattern: "/super-admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: "referring physician",
        pattern: "/referring-physician",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: "radiologist",
        pattern: "/radiologist",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: "technologist",
        pattern: "/technologist",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  });
};
