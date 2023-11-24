import { Bucket, StackContext, use } from "sst/constructs";
import { DBStack } from "./DBStack";

export function FunctionStack({ stack }: StackContext) {
  const materialBucket = new Bucket(stack, "Material-Bucket");
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
    mp4: {
      function: {
        handler: "packages/functions/src/process_video.lambda_handler",
        runtime: "python3.11",
        permissions: ["s3", "transcribe"],
        environment: {
          OUTPUT_BUCKET: materialText.bucketName,
        },
      },
      events: ["object_created"],
      filters: [{ suffix: ".mp4" }],
    },
    png: {
      function: {
        handler: "packages/functions/src/process_image.lambda_handler",
        runtime: "python3.11",
        permissions: ["s3", "textract"],
        environment: {
          OUTPUT_BUCKET: materialText.bucketName,
        },
      },
      events: ["object_created"],
      filters: [{ suffix: ".png" }],
    },
    jpg: {
      function: {
        handler: "packages/functions/src/process_image.lambda_handler",
        runtime: "python3.11",
        permissions: ["s3", "textract"],
        environment: {
          OUTPUT_BUCKET: materialText.bucketName,
        },
      },
      events: ["object_created"],
      filters: [{ suffix: ".jpg" }],
    },
    jpeg: {
      function: {
        handler: "packages/functions/src/process_image.lambda_handler",
        runtime: "python3.11",
        permissions: ["s3", "textract"],
        environment: {
          OUTPUT_BUCKET: materialText.bucketName,
        },
      },
      events: ["object_created"],
      filters: [{ suffix: ".jpeg" }],
    },
  });
  materialText.addNotifications(stack, {
    summarize: {
      function: {
        handler: "packages/functions/src/summarize_text.summarize",
        runtime: "python3.11",
        permissions: ["sagemaker", "s3", "polly"],
        environment: {
          MATERIAL_BUCKET: materialBucket.bucketName,
        },
      },
      events: ["object_created"],
      filters: [{ suffix: ".txt" }],
    },
    json: {
      function: {
        handler: "packages/functions/src/process_json.extract_transcript",
        runtime: "python3.11",
        permissions: ["s3"],
      },
      events: ["object_created"],
      filters: [{ suffix: ".json" }],
    },
  });
  return { materialText, materialBucket };
}
