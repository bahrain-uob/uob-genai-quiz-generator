import { Bucket, RDS, StackContext } from "sst/constructs";

export function DBStack({ stack }: StackContext) {
  const materialBucket = new Bucket(stack, "Material-Bucket");

  const cluster = new RDS(stack, "Cluster", {
    engine: "postgresql11.13",
    defaultDatabaseName: "ali",
    migrations: "packages/core/migrations",
  });

  return { materialBucket, cluster };
}
