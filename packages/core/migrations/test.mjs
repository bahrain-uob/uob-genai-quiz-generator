import { Kysely } from "kysely";
/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable("instructors")
    .addColumn("id", "integer", (col) => col.primaryKey())
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("email", "varchar(255)", (col) => col.notNull())
    .execute();

  // await db
  //   .insertInto("instructors")
  //   .values({
  //     name: "ali aref",
  //     email: "adfad@gmail.com",
  //   })
  //   .execute();
}
/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema.dropTable("instructors").execute();
}
