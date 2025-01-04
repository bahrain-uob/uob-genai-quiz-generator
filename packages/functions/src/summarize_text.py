import json
import os
import boto3
import math
import urllib
from io import BytesIO

bedrock_runtime = boto3.client("bedrock-runtime", region_name="us-east-1")
S3 = boto3.client("s3")


def invoke_model(body, model_id, accept, content_type):
    """
    Invokes Amazon bedrock model to run an inference
    using the input provided in the request body.

    Args:
        body (dict): The invokation body to send to bedrock
        model_id (str): the model to query
        accept (str): input accept type
        content_type (str): content type
    Returns:
        Inference response from the model.
    """

    try:
        response = bedrock_runtime.invoke_model(
            body=json.dumps(body),
            modelId=model_id,
            accept=accept,
            contentType=content_type,
        )

        return response

    except Exception as e:
        print(f"Couldn't invoke {model_id}")
        raise e


def create(prompt_data):
    messages = [{"role": "user", "content": prompt_data}]

    body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 4096,
        "messages": messages,
    }

    modelId = "us.anthropic.claude-3-5-sonnet-20240620-v1:0"  # change this to use a different version from the model provider
    accept = "application/json"
    contentType = "application/json"

    response = invoke_model(body, modelId, accept, contentType)
    response_body = json.loads(response.get("body").read())

    resp_text = response_body["content"][0]["text"]

    return resp_text


def summarize(event, context):
    MATERIAL_BUCKET = os.environ["MATERIAL_BUCKET"]
    summary = ""
    bucket_name = event["Records"][0]["s3"]["bucket"]["name"]
    object_key = urllib.parse.unquote_plus(event["Records"][0]["s3"]["object"]["key"])
    response = S3.get_object(Bucket=bucket_name, Key=object_key)
    topic = response["Body"].read().decode("utf-8")
    prompt = f"""
              Write a summary of the following text. Return your response which covers the key points of the text.

              {topic}
    """
    summary = create(prompt)

    response = S3.put_object(
        Body=summary,
        Bucket=MATERIAL_BUCKET,
        Key=object_key.removesuffix(".txt").replace("materials", "summaries")
        + ".summary",
    )


def partition(text):
    cuts = []
    if len(text) < 10000:
        cuts.append(text)
        return cuts
    words = text
    cut_size = math.ceil(len(words) / 5000)
    for i in range(0, len(words), math.ceil(len(words) / cut_size)):
        cuts.append(words[i : i + math.ceil((len(words) - 1) / cut_size)])
    return cuts


def convert_text_to_speech(text):
    polly_client = boto3.client("polly")

    response = polly_client.synthesize_speech(
        Text=text, OutputFormat="mp3", VoiceId="Joanna", LanguageCode="en-US"
    )
    return response["AudioStream"].read()


def audio(event, context):
    bucket_name = event["Records"][0]["s3"]["bucket"]["name"]
    object_key = urllib.parse.unquote_plus(event["Records"][0]["s3"]["object"]["key"])
    response = S3.get_object(Bucket=bucket_name, Key=object_key)
    summary = response["Body"].read().decode("utf-8")

    chunk_size = 1000
    chunks = [summary[i : i + chunk_size] for i in range(0, len(summary), chunk_size)]
    audio_streams = []
    for chunk in chunks:
        audio_stream = convert_text_to_speech(chunk)
        audio_streams.append(audio_stream)
    concatenated_audio = b"".join(audio_streams)
    audio_fileobj = BytesIO(concatenated_audio)

    S3.put_object(Body=audio_fileobj, Bucket=bucket_name, Key=object_key + ".mp3")
