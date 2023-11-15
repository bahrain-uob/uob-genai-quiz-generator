import json
import os
import boto3
import re
import random
import math

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
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": 128,
                    "top_p": 0.9,
                    "temperature": random.uniform(0.2, 0.3),
                    "return_full_text": False,
                },
            }
        ),
        CustomAttributes="accept_eula=true",
    )
    result = json.loads(response["Body"].read().decode())[0]["generation"]
    parse = re.search(r"{\n(.*?)}", result, re.DOTALL).group(0)
    return parse


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
    Human: i want you to generate 1 MCQ question about  this :
    Cristiano Ronaldo dos Santos Aveiro:  (born 5 February 1985), better known as Ronaldo, is a Portuguese professional footballer who plays as a forward. He is the captain of the Portuguese national team and he is currently playing at Saudi Arabian football club Al Nassr.
    He is considered to be one of the greatest footballers of all time, and, by some, as the greatest ever.
    Ronaldo began his professional career with Sporting CP at age 17 in 2002, and signed for Manchester United a year later. He won three back-to-back Premier League titles: in 2006-07, 2007-08, and 2008-09. In 2007-08, Ronaldo, helped United win the UEFA Champions League. In 2008-09, he won his first FIFA Club World Cup in December 2008, and he also won his first Ballon d'Or. At one point Ronaldo was the most expensive professional footballer of all time, after moving from Manchester United to Real Madrid for approximately £80 m in July 2009

    The output should be a code snippet formatted in the following schema with only one correct answer:
    {
      "question": string // the question
      "choices": string // an array containg all the choices of the question, with only one correct choice, the others should be wrong
      "correct_answer": string // the correct answer from the choices
    }
    Assistant:
    {
      "question": "what is Ronaldo's birthplace?",
      "choices": ["germany", "Portugal", "Spain", "England"],
      "correct_answer": "Portugal"
    }

    Human: i want you to generate 1 MCQ question about  this :
    Apple Inc. is an American multinational technology company headquartered in Cupertino, California.
    As of March 2023, Apple is the world's biggest company by market capitalization, and with US$394.3 billion the largest technology company by 2022 revenue. 
    As of June 2022, Apple is the fourth-largest personal computer vendor by unit sales; the largest manufacturing company by revenue; and the second-largest mobile phone manufacturer in the world. 
    It is considered one of the Big Five American information technology companies, alongside Alphabet (parent company of Google), Amazon, Meta, and Microsoft.
    Apple was founded as Apple Computer Company on April 1, 1976, by Steve Wozniak, Steve Jobs and Ronald Wayne to develop and sell Wozniak's Apple I personal computer. 
    It was incorporated by Jobs and Wozniak as Apple Computer, Inc. in 1977. 

    The output should be a code snippet formatted in the following schema with only one correct answer:
    {
      "question": string // the question
      "choices": string // an array containg all the choices of the question, with only one correct choice, the others should be wrong
      "correct_answer": string // the correct answer from the choices
    }
    Assistant:
    {
      "question": "When was Apple the world's biggest company by market capitilization?",
      "choices": ["March 2023", "June 2023", "May 2023", "March 2022"],
      "correct_answer": "March 2023"
    }
   
    Human: i want you to generate 1 MCQ question about this : {{topic}}
    The output should be a code snippet formatted in the following schema with only one correct answer
    {
      "question": string // the question
      "choices": string // an array containg all the choices of the question, with only one correct choice, the others should be wrong
      "correct_answer": string // the correct answer from the choices
    }  
    Assistant:"""
    prompt = prompt.replace("{{topic}}", topic)
    question = json.loads(create(prompt))
    question["answer_index"] = question["choices"].index(question["correct_answer"])
    return json.dumps(question)
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
    Human: i want you to generate 1 TRUE or FALSE question about  this :
    Cristiano Ronaldo dos Santos Aveiro:  born 5 February 1985), better known as Ronaldo, is a Portuguese professional footballer who plays as a forward. He is the captain of the Portuguese national team and he is currently playing at Saudi Arabian football club Al Nassr.
    He is considered to be one of the greatest footballers of all time, and, by some, as the greatest ever.
    Ronaldo began his professional career with Sporting CP at age 17 in 2002, and signed for Manchester United a year later. He won three back-to-back Premier League titles: in 2006-07, 2007-08, and 2008-09. In 2007-08, Ronaldo, helped United win the UEFA Champions League. In 2008-09, he won his first FIFA Club World Cup in December 2008, and he also won his first Ballon d'Or. At one point Ronaldo was the most expensive professional footballer of all time, after moving from Manchester United to Real Madrid for approximately £80 m in July 2009

    The output should be a code snippet formatted in the following schema with only one correct answer:
    {
      "question": string // the true or false question
      "answer": boolean // the answer of the question (either True or False)
    }
    Assistant:
    {
      "question": "Ronaldo is born in Spain",
      "answer": false
    }

    Human: i want you to generate 1 TRUE or FALSE question about  this :
    Apple Inc. is an American multinational technology company headquartered in Cupertino, California.
    As of March 2023, Apple is the world's biggest company by market capitalization, and with US$394.3 billion the largest technology company by 2022 revenue. 
    As of June 2022, Apple is the fourth-largest personal computer vendor by unit sales; the largest manufacturing company by revenue; and the second-largest mobile phone manufacturer in the world. 
    It is considered one of the Big Five American information technology companies, alongside Alphabet (parent company of Google), Amazon, Meta, and Microsoft.
    Apple was founded as Apple Computer Company on April 1, 1976, by Steve Wozniak, Steve Jobs and Ronald Wayne to develop and sell Wozniak's Apple I personal computer. 
    It was incorporated by Jobs and Wozniak as Apple Computer, Inc. in 1977. 

    The output should be a code snippet formatted in the following schema with only one correct answer:
    {
      "question": string // the true or false question
      "answer": boolean // the answer of the question (either True or False)
    }
    Assistant:
    {
      "question": "Steve jobs is one of the founders of Apple?",
      "answer": true
    }
   
    Human: i want you to generate 1 TRUE or FAlSE question about this : {{topic}}
    The output should be a code snippet formatted in the following schema with only one correct answer
    {
      "question": string // the true or false question
      "answer": boolean // the answer of the question (either True or False)
    }
    Assistant:"""
    prompt = prompt.replace("{{topic}}", topic)
    return json.loads(create(prompt))


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
    Human: i want you to generate 1 fill-in-the-blank question about this :
    Cristiano Ronaldo dos Santos Aveiro:  born 5 February 1985), better known as Ronaldo, is a Portuguese professional footballer who plays as a forward. He is the captain of the Portuguese national team and he is currently playing at Saudi Arabian football club Al Nassr.
    He is considered to be one of the greatest footballers of all time, and, by some, as the greatest ever.
    Ronaldo began his professional career with Sporting CP at age 17 in 2002, and signed for Manchester United a year later. He won three back-to-back Premier League titles: in 2006-07, 2007-08, and 2008-09. In 2007-08, Ronaldo, helped United win the UEFA Champions League. In 2008-09, he won his first FIFA Club World Cup in December 2008, and he also won his first Ballon d'Or. At one point Ronaldo was the most expensive professional footballer of all time, after moving from Manchester United to Real Madrid for approximately £80 m in July 2009

    The output should be a code snippet formatted in the following schema with one blank to be filled:
    {
      "question": string // the question with 1 blank to be filled
      "answer": string // the correct answer to fill the blank
    }
    Assistant:
    {
      "question": "Ronaldo won his first Ballon d'Or in ________ .",
      "answer": "2008"
    } 

    Human: i want you to generate 1 fill-in-the-blank question about this :
    Apple Inc. is an American multinational technology company headquartered in Cupertino, California.
    As of March 2023, Apple is the world's biggest company by market capitalization, and with US$394.3 billion the largest technology company by 2022 revenue. 
    As of June 2022, Apple is the fourth-largest personal computer vendor by unit sales; the largest manufacturing company by revenue; and the second-largest mobile phone manufacturer in the world. 
    It is considered one of the Big Five American information technology companies, alongside Alphabet (parent company of Google), Amazon, Meta, and Microsoft.
    Apple was founded as Apple Computer Company on April 1, 1976, by Steve Wozniak, Steve Jobs and Ronald Wayne to develop and sell Wozniak's Apple I personal computer. 
    It was incorporated by Jobs and Wozniak as Apple Computer, Inc. in 1977

    The output should be a code snippet formatted in the following schema with one blank to be filled:
    {
      "question": string // the question with 1 blank to be filled
      "answer": string // the correct answer to fill the blank
    }
    Assistant:
    {
      "question": "Apple Inc. is an ________ multinational technology company headquartered in Cupertino, California.",
      "answer": "American"
    } 

    Human: i want you to generate 1 fill-in-the-blank question about this :
    Cloud computing is the on-demand availability of computing resources (such as storage and infrastructure), as services over the internet. 
    It eliminates the need for individuals and businesses to self-manage physical resources themselves, and only pay for what they use.
    Cloud computing service models are based on the concept of sharing on-demand computing resources, software, and information over the internet.
    Companies or individuals pay to access a virtual pool of shared resources, including compute, storage, and networking services, which are located on remote servers that are owned and managed by service providers. 

    The output should be a code snippet formatted in the following schema with one blank to be filled:
    {
      "question": string // the question with 1 blank to be filled
      "answer": string // the correct answer to fill the blank
    }
    Assistant:
    {
      "question": "Cloud computing is the _______ availability of computing resources (such as storage and infrastructure), as services over the internet.",
      "answer": "on-demand"
    } 

    Human: i want you to generate 1 fill-in-the-blank question about this : {{topic}}

    The output should be a code snippet formatted in the following schema with one blank to be filled:
    {
      "question": string // the question with 1 blank to be filled
      "answer": string // the correct answer to fill the blank
    } 
    Assistant: """

    prompt = prompt.replace("{{topic}}", topic)
    return json.loads(create(prompt))


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
