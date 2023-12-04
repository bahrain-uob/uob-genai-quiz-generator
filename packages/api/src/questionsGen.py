import json
import os
import boto3
import re
import random
import math

endpoint_name = "jumpstart-dft-meta-textgeneration-llama-2-13b"  # need to make environ
sm_client = boto3.client("sagemaker-runtime", region_name="us-east-1")
s3 = boto3.client("s3")
TEXT_BUCKET = os.environ["TEXT_BUCKET"]


# def create_prompt(instruction: str, user: str):
#     p = "<s>[INST] <<SYS>>\n"
#     p += instruction
#     p += "\n<</SYS>>\n\n"
#     p += user
#     return p


def create_prompt(s: str):
    return "<s>[INST] {s} [/INST]".replace("{s}", s)


def create(prompt):
    response = sm_client.invoke_endpoint(
        EndpointName=endpoint_name,
        ContentType="application/json",
        Body=json.dumps(
            {
                "inputs": create_prompt(prompt),
                "parameters": {
                    "max_new_tokens": 128,
                    "top_p": 0.9,
                    # "temperature": random.uniform(0.2, 0.3),
                    "temperature": 0.9,
                    "return_full_text": False,
                },
            }
        ),
        CustomAttributes="accept_eula=true",
    )
    result = json.loads(response["Body"].read().decode())[0]["generated_text"]
    print(result)
    parse = re.search(r"{\n(.*?)}", result, re.DOTALL).group(0)
    print(parse)
    return json.loads(parse)


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
    i want you to generate 1 MCQ question about this :
    {{topic}}

    The output should be a code snippet formatted in the following schema(JSON) with only one correct answer:
    {
      "question": string, // the question
      "choices": string, // an array containg all the choices of the question, with only one correct choice, the others should be wrong
      "correct_answer": string // the correct answer from the choices, should be the answer itself, not the index of the choice, 
    }
    """
    prompt = prompt.replace("{{topic}}", topic)
    question = create(prompt)
    question["answer_index"] = question["choices"].index(question["correct_answer"])
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
    i want you to generate 1 TRUE or FAlSE question about this :
    {{topic}}

    The output should be a code snippet formatted in the following schema(JSON) with only one correct answer
    {
      "question": string, // the true or false question
      "answer": boolean// the answer of the question (either true or false)
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
    i want you to generate 1 fill-in-the-blank question about this : 
    {{topic}}

    The output should be a code snippet formatted in the following schema(JSON) with one blank to be filled:
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
