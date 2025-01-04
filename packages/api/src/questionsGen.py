import json
import os
import boto3
import re
import random
import math

bedrock_runtime = boto3.client("bedrock-runtime", region_name="us-east-1")
s3 = boto3.client("s3")
TEXT_BUCKET = os.environ["TEXT_BUCKET"]


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
        "max_tokens": 500,
        "messages": messages,
    }

    modelId = "us.anthropic.claude-3-5-sonnet-20240620-v1:0"  # change this to use a different version from the model provider
    accept = "application/json"
    contentType = "application/json"

    response = invoke_model(body, modelId, accept, contentType)
    response_body = json.loads(response.get("body").read())

    resp_text = response_body["content"][0]["text"]
    resp_text = re.search(r"{\n(.*?)}", resp_text, re.DOTALL).group(0)
    resp_text = json.loads(resp_text)

    return resp_text


def mcq(event, context):
    body = json.loads(event["body"])
    user_id = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
    materials = body["materials"]
    course_id = body["course_id"]
    cutted_text = []
    for material in materials:
        object_key = user_id + "/" + course_id + "/materials/" + material + ".txt"
        response = s3.get_object(Bucket=TEXT_BUCKET, Key=object_key)
        topic = response["Body"].read().decode("utf-8")
        cutted_text.extend(partition(topic))
    topic = cutted_text[random.randint(0, len(cutted_text) - 1)]
    prompt = """
    I want you to generate 1 MCQ question about this:
    {{topic}}

    The output should be a code snippet formatted in the following schema (JSON) with only one correct answer:
    {
      "question": string, // the question
      "choices": string, // an array containg all the choices of the question, with only one correct choice, the others should be wrong
      "answer_index": number // the correct answer from the choices, should be the index of the answer 
    }
    """
    prompt = prompt.replace("{{topic}}", topic)
    question = create(prompt)
    print(question)
    return question


def tf(event, context):
    body = json.loads(event["body"])
    user_id = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
    materials = body["materials"]
    course_id = body["course_id"]
    cutted_text = []
    for material in materials:
        object_key = user_id + "/" + course_id + "/materials/" + material + ".txt"
        response = s3.get_object(Bucket=TEXT_BUCKET, Key=object_key)
        topic = response["Body"].read().decode("utf-8")
        cutted_text.extend(partition(topic))
    topic = cutted_text[random.randint(0, len(cutted_text) - 1)]
    prompt = """ 
    I want you to generate 1 TRUE or FAlSE question about this :
    {{topic}}

    The output should be a code snippet formatted in the following schema (JSON) with only one correct answer
    {
      "question": string, // the true or false question
      "answer": boolean // the answer of the question (either true or false)
    }
    """
    prompt = prompt.replace("{{topic}}", topic)
    question = create(prompt)
    return question


def fib(event, context):
    body = json.loads(event["body"])
    user_id = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
    materials = body["materials"]
    course_id = body["course_id"]
    cutted_text = []
    for material in materials:
        object_key = user_id + "/" + course_id + "/materials/" + material + ".txt"
        response = s3.get_object(Bucket=TEXT_BUCKET, Key=object_key)
        topic = response["Body"].read().decode("utf-8")
        cutted_text.extend(partition(topic))
    topic = cutted_text[random.randint(0, len(cutted_text) - 1)]
    prompt = """
    I want you to generate 1 fill-in-the-blank question about this: 
    {{topic}}

    The output should be a code snippet formatted in the following schema (JSON) with one blank to be filled:
    {
      "question": string, // the question with 1 blank to be filled
      "answer": string // the correct answer to fill the blank 
    } 
    """

    prompt = prompt.replace("{{topic}}", topic)
    return create(prompt)


def partition(text):
    words = text.split()
    cut_size = math.ceil(len(words) / 500)
    cuts = []
    mergedcuts = []
    for i in range(0, len(words), math.ceil(len(words) / cut_size)):
        cuts.append(words[i : i + math.ceil((len(words) - 1) / cut_size)])
    for item in cuts:
        mergedcuts.append(" ".join(item))
    return mergedcuts
