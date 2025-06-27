import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION = "us-east-1";
const BUCKET_NAME = "s3-source-image-bucket";

const s3 = new S3Client({ region: REGION });

export const handler = async (event) => {
  const filename = event.queryStringParameters?.filename || "default.jpg";

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filename,
    ContentType: "image/jpeg"
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 300 });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  };
};
