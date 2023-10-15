import boto3
import os

def lambda_handler(event, context):
    
    record = event['Records'][0]
    s3bucket = record['s3']['bucket']['name']
    s3object = record['s3']['object']['key']
        
    s3Path = "s3://" + s3bucket + "/" + s3object
    jobName = s3object

    client = boto3.client('transcribe')
    try:
        response = client.start_transcription_job(
            TranscriptionJobName=jobName,
            LanguageCode='en-US',
            MediaFormat='mp4',
            Media={
                'MediaFileUri': s3Path
            },
            OutputBucketName=os.environ["OUTPUT_BUCKET"],
            OutputKey = jobName + '.txt'
        )

        return {
            'TranscriptionJobName': response['TranscriptionJob']['TranscriptionJobName']
        }
    except Exception as e:
        print('Error'+ str(e))