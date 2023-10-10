import { Bucket, Table, StackContext } from "sst/constructs";

export function DBStack({ stack }: StackContext) {
  // Create the table
  const table = new Table(stack, "Counter", {
    fields: {
      counter: "string",
    },
    primaryIndex: { partitionKey: "counter" },
  });

  const materialBucket = new Bucket(stack, "Material-Bucket");

  return { table, materialBucket };
}
