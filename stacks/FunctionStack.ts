import { StackContext, use } from "sst/constructs";
import { DBStack } from "./DBStack";

export function FunctionStack({ stack }: StackContext) {
  const { materialBucket } = use(DBStack);

  materialBucket.addNotifications(stack, {
    docx: {
      function: {
        handler: "packages/functions/src/process_docx.handler",
        runtime: "python3.11",
        permissions: ["s3"],
      },
      events: ["object_created"],
      filters: [{ suffix: ".docx" }],
    },
  });

  // This is an example of creating notification, modify for your use
  //
  // materialBucket.addNotifications(stack, {
  //   notification1: {
  //     function: "packages/functions/src/pdf.main",
  //     events: ["object_created"],
  //     filters: [{ suffix: ".pdf" }],
  //   },
  //   notification2: {
  //     function: "packages/functions/src/pptx.main",
  //     events: ["object_created"],
  //     filters: [{ suffix: ".txt" }],
  //   },
  // });
}
