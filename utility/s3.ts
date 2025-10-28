import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import html2canvas from 'html2canvas-pro';

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
  },
});


export const uploadImageToS3 = async (
  bucketName: string,
  key: string,
  imageBlob: Buffer,
  contentType: string
): Promise<string> => {
  try {
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: imageBlob,
      ContentType: contentType,
      ACL: "public-read",  // Make object publicly readable on upload
    });

    await s3Client.send(putCommand);

    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (err) {
    console.error("Error uploading image to S3:", err);
    throw new Error("Failed to upload image to S3");
  }
};

export async function takeScreenCapture(): Promise<Blob | null> {
  try {
    const element = document.body; // Capture the entire visible body content
    const canvas = await html2canvas(element);
    // Convert the canvas to a Blob (PNG)
    return await new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          resolve(null);
        }
      }, 'image/png');
    });
  } catch (error) {
    console.error('Error taking screenshot:', error);
    return null;
  }
}

export const listImagesInS3Bucket = async (bucketName: string): Promise<string[]> => {
  try {
    const command = new ListObjectsV2Command({ Bucket: bucketName });
    const response = await s3Client.send(command);

    return (
      response.Contents?.map((item: { Key?: string }) => `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`) || []
    );
  } catch (err) {
    console.error("Error listing images in S3 bucket:", err);
    throw new Error("Failed to list images in S3 bucket");
  }
};
