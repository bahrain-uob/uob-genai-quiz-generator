import { Table, Bucket, StackContext } from "sst/constructs";

export function DBStack({ stack }: StackContext) {
  const materialBucket = new Bucket(stack, "Material-Bucket");
  const courses_table = new Table(stack, "courses", {
    fields: {
      user_id: "string",
      course_id: "string",
      course_name: "string",
    },
    primaryIndex: { partitionKey: "user_id", sortKey: "course_id" },
  });
  return { materialBucket, courses_table };
}
