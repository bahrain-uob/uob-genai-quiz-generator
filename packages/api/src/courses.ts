import { Kysely } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { RDSData } from "@aws-sdk/client-rds-data";
import { RDS } from "sst/node/rds";

interface Database {
  instructors: {
    name: string;
    email: string;
  };
}

const db = new Kysely<Database>({
  dialect: new DataApiDialect({
    mode: "postgres",
    driver: {
      database: RDS.Cluster.defaultDatabaseName,
      secretArn: RDS.Cluster.secretArn,
      resourceArn: RDS.Cluster.clusterArn,
      client: new RDSData({}),
    },
  }),
});

export async function get() {
  const record = await db.selectFrom("instructors").selectAll().execute();
  return {
    statusCode: 200,
    // body: JSON.stringify([
    // { id: 1, code: "ITCS441", name: "Parallel" },
    // { id: 2, code: "ITCS453", name: "Multimedia" },
    // ]),
    body: JSON.stringify(record),
  };
}
