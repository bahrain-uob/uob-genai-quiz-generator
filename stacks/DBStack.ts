import { Table, Bucket, StackContext } from "sst/constructs";

export function DBStack({ stack }: StackContext) {
  const quiz_bucket = new Bucket(stack, "quiz");

  const courses_table = new Table(stack, "courses", {
    fields: {
      user_id: "string",
      course_id: "string",
      course_code: "string",
      course_name: "string",
    },
    primaryIndex: { partitionKey: "user_id", sortKey: "course_id" },
  });

  return { quiz_bucket, courses_table };
}
