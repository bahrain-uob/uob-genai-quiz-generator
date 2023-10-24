import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { Bucket } from "sst/node/bucket";

const s3 = new S3Client();

export const get = async (event: APIGatewayProxyEventV2) => {
  if (!event.body) return { statusCode: 400 };

  const course_id: string = JSON.parse(event.body).course_id;
  if (!course_id) return { statusCode: 400 };

  const prefix = `${course_id}/`;
  const command = new ListObjectsV2Command({
    Bucket: Bucket["Material-Bucket"].bucketName,
    Prefix: prefix,
    StartAfter: prefix,
  });

  let response;
  try {
    response = await s3.send(command);
  } catch {
    return { statusCode: 500 };
  }
  if (!response.Contents)
    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: "{}",
    };
  let content = response.Contents.map((e) => ({
    name: e.Key?.slice(prefix.length),
    last_modified: e.LastModified,
    size: e.Size,
  }));

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(content),
  };
};

export async function post() {
  return {
    statusCode: 200,
    body: "TODO",
  };
}
