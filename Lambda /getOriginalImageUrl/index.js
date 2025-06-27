import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION = "us-east-1";
const BUCKET = process.env.SRC_BUCKET;

const s3 = new S3Client({ region: REGION });

export const handler = async (event) => {
  const filename = event.queryStringParameters?.filename;

  if (!filename) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Filename is required" }),
    };
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: filename,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 300 });

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({ url }),
  };
};
