import boto3
import os
import time
import urllib

OUTPUT_BUCKET = os.environ["OUTPUT_BUCKET"]


def lambda_handler(event, context):
    textract = boto3.client("textract")
    s3 = boto3.client("s3")

    bucket = event["Records"][0]["s3"]["bucket"]["name"]
    key = urllib.parse.unquote_plus(event["Records"][0]["s3"]["object"]["key"])
    document_location = {"S3Object": {"Bucket": bucket, "Name": key}}

    try:
        response = textract.start_document_text_detection(
            DocumentLocation=document_location
        )
        job_id = response["JobId"]

        while True:
            response = textract.get_document_text_detection(JobId=job_id)
            status = response["JobStatus"]

            if status in ["SUCCEEDED", "FAILED"]:
                break

            time.sleep(5)

        if status == "SUCCEEDED":
            detected_text = []
            for item in response["Blocks"]:
                if item["BlockType"] == "LINE":
                    detected_text.append(
                        {
                            "Text": item["Text"],
                            "BoundingBox": item["Geometry"]["BoundingBox"],
                        }
                    )

            detected_text.sort(key=lambda x: x["BoundingBox"]["Top"])
            text_content = ""
            for text in detected_text:
                text_content += f"{text['Text']}\n"

            file_name = os.path.splitext(key)[0]
            output_key = f"{file_name}.txt"

            s3.put_object(
                Body=text_content,
                Bucket=OUTPUT_BUCKET,
                Key=output_key,
                ContentType="text/plain",
            )
        else:
            error_message = response.get("StatusMessage", "Text extraction failed")
            print(f"Error message: {error_message}")

    except Exception as e:
        print(f"Error: {str(e)}")
