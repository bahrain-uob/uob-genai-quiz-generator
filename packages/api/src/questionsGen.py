import json
import os
import boto3
import re
import random
import math

topic = """
Amazon S3 or Amazon Simple Storage Service is a service offered by Amazon Web Services (AWS) that provides object storage through a web service interface.[1][2] Amazon S3 uses the same scalable storage infrastructure that Amazon.com uses to run its e-commerce network.[3] Amazon S3 can store any type of object, which allows uses like storage for Internet applications, backups, disaster recovery, data archives, data lakes for analytics, and hybrid cloud storage. AWS launched Amazon S3 in the United States on March 14, 2006,[1][4] then in Europe in November 2007.[5]
Amazon S3 manages data with an object storage architecture[6] which aims to provide scalability, high availability, and low latency with high durability.[3] The basic storage units of Amazon S3 are objects which are organized into buckets. Each object is identified by a unique, user-assigned key.[7] Buckets can be managed using the console provided by Amazon S3, programmatically with the AWS SDK, or the REST application programming interface. Objects can be up to five terabytes in size.[8][9] Requests are authorized using an access control list associated with each object bucket and support versioning[10] which is disabled by default.[11] Since buckets are typically the size of an entire file system mount in other systems, this access control scheme is very coarse-grained. In other words, unique access controls cannot be associated with individual files.[citation needed] Amazon S3 can be used to replace static web-hosting infrastructure with HTTP client-accessible objects,[12] index document support, and error document support.[13] The Amazon AWS authentication mechanism allows the creation of authenticated URLs, valid for a specified amount of time. Every item in a bucket can also be served as a BitTorrent feed. The Amazon S3 store can act as a seed host for a torrent and any BitTorrent client can retrieve the file. This can drastically reduce the bandwidth cost for the download of popular objects. A bucket can be configured to save HTTP log information to a sibling bucket; this can be used in data mining operations.[14] There are various User Mode File System (FUSE)–based file systems for Unix-like operating systems (for example, Linux) that can be used to mount an S3 bucket as a file system. The semantics of the Amazon S3 file system are not that of a POSIX file system, so the file system may not behave entirely as expected.[15]
"""
# endpoint_name = os.environ["LLAMA_2_13B_ENDPOINT"]
endpoint_name = "jumpstart-dft-meta-textgeneration-llama-2-13b"  # need to make environ
sm_client = boto3.client("sagemaker-runtime")
s3 = boto3.client("s3")
TEXT_BUCKET = os.environ["TEXT_BUCKET"]


def create(prompt):
    response = sm_client.invoke_endpoint(
        EndpointName=endpoint_name,
        ContentType="application/json",
        Body=json.dumps(
            {
                "inputs": [[{"role" : "user", "content" : prompt}]],
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
    result = json.loads(response["Body"].read().decode())[0]["generation"]["content"]
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
    # return  json.loads(create(prompt))


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
    question =  create(prompt)
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