import boto3
from PyPDF2 import PdfReader
import io
from botocore.exceptions import ClientError
import os

S3 = boto3.client("s3")
OUTPUT_BUCKET = os.environ["OUTPUT_BUCKET"]


def handler(event, context):
    text = ""
    bucket_name = event["Records"][0]["s3"]["bucket"]["name"]
    object_key = event["Records"][0]["s3"]["object"]["key"]

    try:
        response = S3.get_object(Bucket=bucket_name, Key=object_key)
        data = response["Body"].read()
        remote_file_bytes = io.BytesIO(data)

        reader = PdfReader(remote_file_bytes)
        number_of_pages = len(reader.pages)

        for index in range(number_of_pages):
            page = reader.pages[index]
            text += page.extract_text()

        response = S3.put_object(Body=text, Bucket=OUTPUT_BUCKET, Key=object_key)

    except ClientError as e:
        print(f"Error parsing the PDF: {e}")
