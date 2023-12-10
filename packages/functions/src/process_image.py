import boto3
import os
import urllib

OUTPUT_BUCKET = os.environ["OUTPUT_BUCKET"]


def lambda_handler(event, context):
    textract = boto3.client("textract", region_name="us-east-1")
    s3 = boto3.client("s3")

    bucket = event["Records"][0]["s3"]["bucket"]["name"]
    key = urllib.parse.unquote_plus(event["Records"][0]["s3"]["object"]["key"])

    response = s3.get_object(Bucket=bucket, Key=key)
    object_content = response["Body"].read()

    try:
        response = textract.detect_document_text(Document={"Bytes": object_content})

        blocks = response["Blocks"]
        extracted_text = ""
        for block in blocks:
            if block["BlockType"] == "LINE":
                extracted_text += block["Text"] + "\n"

        output_key = f"{key}.txt"

        s3.put_object(
            Body=extracted_text,
            Bucket=OUTPUT_BUCKET,
            Key=output_key,
            ContentType="text/plain",
        )

    except Exception as e:
        print(f"Error: {str(e)}")

