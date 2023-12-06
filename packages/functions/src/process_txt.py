import boto3
import os
import urllib

S3 = boto3.client("s3")
OUTPUT_BUCKET = os.environ["OUTPUT_BUCKET"]


def handler(event, context):
    text = ""
    bucket_name = event["Records"][0]["s3"]["bucket"]["name"]
    object_key = urllib.parse.unquote_plus(event["Records"][0]["s3"]["object"]["key"])

    response = S3.get_object(Bucket=bucket_name, Key=object_key)
    text = response["Body"].read()

    response = S3.put_object(Body=text, Bucket=OUTPUT_BUCKET, Key=object_key + ".txt")
