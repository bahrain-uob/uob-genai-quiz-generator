import boto3
import os
import time
OUTPUT_BUCKET = os.environ["OUTPUT_BUCKET"]

def lambda_handler(event, context):
    # Specify the S3 bucket and object key for the input document
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']

    # Create an Amazon Textract client
    textract = boto3.client('textract')
    s3 = boto3.client('s3')

    # Specify the S3 object as the source for text detection
    document_location = {'S3Object': {'Bucket': bucket, 'Name': key}}

    try:
        # Start the text detection job
        response = textract.start_document_text_detection(
            DocumentLocation=document_location
        )

        # Get the JobId for the text detection job
        job_id = response['JobId']

        # Wait for the job to complete
        while True:
            response = textract.get_document_text_detection(JobId=job_id)
            status = response['JobStatus']

            if status in ['SUCCEEDED', 'FAILED']:
                break

            time.sleep(5)

        if status == 'SUCCEEDED':
            # Extract the detected text and bounding box information
            detected_text = []
            for item in response['Blocks']:
                if item['BlockType'] == 'LINE':
                    detected_text.append({
                        'Text': item['Text'],
                        'BoundingBox': item['Geometry']['BoundingBox']
                    })

            # Sort the detected text based on the vertical position of the bounding box
            detected_text.sort(key=lambda x: x['BoundingBox']['Top'])

            # Combine the detected text into a single string with newlines and preserve the layout
            text_content = ''
            for text in detected_text:
                text_content += f"{text['Text']}\n"

            # Remove the file extension from the document file name
            file_name = os.path.splitext(key)[0]

            # Specify the S3 bucket and object key for storing the text file
            #output_bucket = 'output-from-amazontextract'
            output_key = f'{file_name}.txt'

            # Upload the text file to the output bucket
            s3.put_object(Body=text_content, Bucket=OUTPUT_BUCKET, Key=output_key, ContentType='text/plain')

            # Return a successful response
            return {
                'statusCode': 200,
                'body': 'Text extraction successful'
            }
        else:
            # Handle the case where the job has failed
            error_message = response.get('StatusMessage', 'Text extraction failed')
            print(f'Error message: {error_message}')

            # Return an error response
            return {
                'statusCode': 500,
                'body': 'Text extraction failed'
            }
    except Exception as e:
        # Handle any errors that occur during the text detection process
        print(f'Error: {str(e)}')

        # Return an error response
        return {
            'statusCode': 500,
            'body': 'Text extraction failed'
        }

