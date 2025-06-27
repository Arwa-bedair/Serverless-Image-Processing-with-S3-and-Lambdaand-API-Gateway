import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "us-east-1" });
const BUCKET_NAME = process.env.DEST_BUCKET;

export const handler = async (event) => {
  const filename = event.queryStringParameters?.filename;

  if (!filename) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing filename parameter" }),
    };
  }

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
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
  } catch (err) {
    console.error("Error generating signed URL:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate URL" }),
    };
  }
};
