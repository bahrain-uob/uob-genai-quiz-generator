import boto3
import docx2txt
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

        text = docx2txt.process(remote_file_bytes)

        s3_key = fileName + ".txt"

        response = s3.put_object(Body=text, Bucket=bucket_name, Key=s3_key)

    except ClientError as e:
        print(f"Error parsing the word file : {e}")
