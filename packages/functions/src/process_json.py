import json
import boto3
import urllib
import base64


def extract_transcript(event, context):
    s3 = boto3.client("s3")

    bucket_name = event["Records"][0]["s3"]["bucket"]["name"]
    json_key = urllib.parse.unquote_plus(event["Records"][0]["s3"]["object"]["key"])

    output_file_name = (
        str(base64.b16decode(json_key.removesuffix(".json")), "utf-8") + ".txt"
    )
    try:
        response = s3.get_object(Bucket=bucket_name, Key=json_key)
        json_data = response["Body"].read().decode("utf-8")
        data = json.loads(json_data)
        transcript = data["results"]["transcripts"][0]["transcript"]

        s3.put_object(Body=transcript, Bucket=bucket_name, Key=output_file_name)

        return {
            "statusCode": 200,
            "body": "Transcript extracted and stored successfully.",
        }

    except Exception as e:
        return {"statusCode": 500, "body": f"Error: {str(e)}"}
