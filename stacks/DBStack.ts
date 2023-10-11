import { Bucket, StackContext } from "sst/constructs";

export function DBStack({ stack }: StackContext) {
  const materialBucket = new Bucket(stack, "Material-Bucket");

  return { materialBucket };
}
