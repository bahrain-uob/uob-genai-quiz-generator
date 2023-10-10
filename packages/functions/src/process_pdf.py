import boto3
from PyPDF2 import PdfReader
import io
from botocore.exceptions import ClientError

s3 = boto3.client("s3")


def handler(event, context):
    text = ""
    bucket_name = event["Records"][0]["s3"]["bucket"]["name"]
    fileName = event["Records"][0]["s3"]["object"]["key"]

    try:
        response = s3.get_object(Bucket=bucket_name, Key=fileName)
        data = response["Body"].read()
        remote_file_bytes = io.BytesIO(data)

        reader = PdfReader(remote_file_bytes)
        number_of_pages = len(reader.pages)

        for index in range(number_of_pages):
            page = reader.pages[index]
            text += page.extract_text()

        s3_key = fileName + ".txt"

        response = s3.put_object(Body=text, Bucket=bucket_name, Key=s3_key)

    except ClientError as e:
        print(f"Error parsing the PDF: {e}")
