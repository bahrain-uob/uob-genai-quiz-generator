import boto3
import os
import uuid


def lambda_handler(event, context):
    record = event["Records"][0]
    s3bucket = record["s3"]["bucket"]["name"]
    s3object = record["s3"]["object"]["key"].replace("+", " ")

    s3Path = "s3://" + s3bucket + "/" + s3object
    jobName = str(uuid.uuid4())

    client = boto3.client("transcribe")
    try:
        response = client.start_transcription_job(
            TranscriptionJobName=jobName,
            LanguageCode="en-US",
            MediaFormat="mp4",
            Media={"MediaFileUri": s3Path},
            OutputBucketName=os.environ["OUTPUT_BUCKET"],
            OutputKey=jobName + ".json",
        )

        return {
            "TranscriptionJobName": response["TranscriptionJob"]["TranscriptionJobName"]
        }
    except Exception as e:
        print("Error" + str(e))
