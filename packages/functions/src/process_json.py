import json
import boto3
import urllib


def extract_transcript(event, context):
    # Get the S3 bucket and JSON file information from the event
    bucket_name = event["Records"][0]["s3"]["bucket"]["name"]
    json_key = urllib.parse.unquote_plus(event["Records"][0]["s3"]["object"]["key"])

    # Set the output file name
    output_file_name = json_key.replace(".json", ".txt")

    # Create an S3 client
    s3 = boto3.client("s3")

    try:
        # Read the JSON file from S3
        response = s3.get_object(Bucket=bucket_name, Key=json_key)
        json_data = response["Body"].read().decode("utf-8")

        # Parse the JSON data
        data = json.loads(json_data)

        # Extract the transcript from the JSON data
        transcript = data["results"]["transcripts"][0]["transcript"]

        # Upload the transcript to a text file in S3
        s3.put_object(Body=transcript, Bucket=bucket_name, Key=output_file_name)

        # Delete the json file from s3
        s3.delete_object(Bucket=bucket_name, Key=json_key)

        return {
            "statusCode": 200,
            "body": "Transcript extracted and stored successfully.",
        }

    except Exception as e:
        return {"statusCode": 500, "body": f"Error: {str(e)}"}
