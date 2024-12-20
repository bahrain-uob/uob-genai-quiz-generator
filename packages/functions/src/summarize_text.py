import json
import os
import boto3
import re
import math
import urllib
from io import BytesIO

endpoint_name = "jumpstart-dft-meta-textgeneration-llama-2-13b"  # need to make environ
sm_client = boto3.client("sagemaker-runtime", region_name="us-east-1")
S3 = boto3.client("s3")


def summarize(event, context):
    MATERIAL_BUCKET = os.environ["MATERIAL_BUCKET"]
    summary = ""
    bucket_name = event["Records"][0]["s3"]["bucket"]["name"]
    object_key = urllib.parse.unquote_plus(event["Records"][0]["s3"]["object"]["key"])
    response = S3.get_object(Bucket=bucket_name, Key=object_key)
    topic = response["Body"].read().decode("utf-8")
    prompt = """
              Write a summary of the following text delimited by triple backticks. Return your response which covers the key points of the text.
              ```{{topic}}```
    """
    topics = partition(topic)
    for ben in topics:
        input = prompt.replace("{{topic}}", ben)
        response = sm_client.invoke_endpoint(
            EndpointName=endpoint_name,
            ContentType="application/json",
            Body=json.dumps(
                {
                    "inputs": "<s>[INST]" + input + "[/INST]",
                    "parameters": {
                        "max_new_tokens": 2024,
                        "top_p": 0.9,
                        # "temperature": random.randfloat(0.7,1),
                        "temperature": 0.7,
                        "return_full_text": False,
                    },
                }
            ),
            CustomAttributes="accept_eula=true",
        )
        result = json.loads(response["Body"].read().decode())[0]["generated_text"]
        print(result)
        try:
            result = re.search(r"```\n(.*?)```", result, re.DOTALL).group(1)
        except:
            continue
        summary = summary + result + "\n"

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

