import { Bucket, StackContext, use } from "sst/constructs";
import { DBStack } from "./DBStack";

export function FunctionStack({ stack }: StackContext) {
  const { materialBucket } = use(DBStack);

  const materialText = new Bucket(stack, "Material-Text");

  materialBucket.addNotifications(stack, {
    pdf: {
      function: {
        handler: "packages/functions/src/process_pdf.handler",
        runtime: "python3.11",
        permissions: ["s3"],
        environment: {
          OUTPUT_BUCKET: materialText.bucketName,
        },
      },
      events: ["object_created"],
      filters: [{ suffix: ".pdf" }],
    },
    docx: {
      function: {
        handler: "packages/functions/src/process_docx.handler",
        runtime: "python3.11",
        permissions: ["s3"],
        environment: {
          OUTPUT_BUCKET: materialText.bucketName,
        },
      },
      events: ["object_created"],
      filters: [{ suffix: ".docx" }],
    },
    pptx: {
      function: {
        handler: "packages/functions/src/process_pptx.handler",
        runtime: "python3.11",
        permissions: ["s3"],
        environment: {
          OUTPUT_BUCKET: materialText.bucketName,
        },
      },
      events: ["object_created"],
      filters: [{ suffix: ".pptx" }],
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
