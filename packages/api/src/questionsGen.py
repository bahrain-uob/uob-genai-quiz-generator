import json
import os
import boto3
import requests

# endpoint_name = os.environ["LLAMA_2_13B_ENDPOINT"]
endpoint_name = "jumpstart-dft-meta-textgeneration-llama-2-7b"  # need to make environ
sm_client = boto3.client("sagemaker-runtime")
topic = "javascript"
s3 = boto3.client("s3")
TEXT_BUCKET = os.environ["TEXT_BUCKET"]
object_key = "AI.pptx.txt"
topic = """
Cristiano Ronaldo dos Santos Aveiro:  born 5 February 1985), better known as Ronaldo, is a Portuguese professional footballer who plays as a forward. He is the captain of the Portuguese national team and he is currently playing at Saudi Arabian football club Al Nassr.
He is considered to be one of the greatest footballers of all time, and, by some, as the greatest ever.
Ronaldo began his professional career with Sporting CP at age 17 in 2002, and signed for Manchester United a year later. He won three back-to-back Premier League titles: in 2006-07, 2007-08, and 2008-09. In 2007-08, Ronaldo, helped United win the UEFA Champions League. In 2008-09, he won his first FIFA Club World Cup in December 2008, and he also won his first Ballon d'Or. At one point Ronaldo was the most expensive professional footballer of all time, after moving from Manchester United to Real Madrid for approximately £80 m in July 2009.
"""
# topic = """
# ITCE464: Intelligent System LESSON  1 Part 1
# Lesson 1 : What is Intelligence
# Dr. Alauddin Al-Omary
# What is Intelligence?
# The ability of a system to:
# calculate,
# reason,
# perceive relationships and analogies,
# learn from experience,
# store and retrieve information from memory,
# solve problems,
# comprehend complex ideas,
# use natural language fluently,
# classify, generalize, and
# adapt new situations.
# What is Intelligence Composed of?
# The intelligence is intangible. It is composed of −
# Reasoning
# Learning
# Problem Solving
# Perception
# Linguistic Intelligence
# """
topic = """
Amazon S3 or Amazon Simple Storage Service is a service offered by Amazon Web Services (AWS) that provides object storage through a web service interface.Amazon S3 uses the same scalable storage infrastructure that Amazon.com uses to run its e-commerce network.
Amazon S3 can store any type of object, which allows uses like storage for Internet applications, backups, disaster recovery, data archives, data lakes for analytics, and hybrid cloud storage.
AWS launched Amazon S3 in the United States on March 14, 2006, then in Europe in November 2007.
"""
topic = """

Amazon Web Services, Inc. (AWS) is a subsidiary of Amazon that provides on-demand cloud computing platforms and APIs to individuals, companies, and governments, on a metered, pay-as-you-go basis.
Clients will often use this in combination with autoscaling (a process that allows a client to use more computing in times of high application usage, and then scale down to reduce costs when there is less traffic).
These cloud computing web services provide various services related to networking, compute, storage, middleware, IoT and other processing capacity, as well as software tools via AWS server farms.
This frees clients from managing, scaling, and patching hardware and operating systems.
One of the foundational services is Amazon Elastic Compute Cloud (EC2), which allows users to have at their disposal a virtual cluster of computers, with extremely high availability, which can be interacted with over the internet via REST APIs, a CLI or the AWS console.

"""
import re
user_id=  "47b81c1f-887b-4702-aebc-a2e04760e80c"
course_id ="33e64777-7a00-45af-bbde-957fd6e07319"
materials = "dynamodb"
def create(prompt):
    # parameters needed,
    # user id
    # course id
    # material id

    response = sm_client.invoke_endpoint(
        EndpointName=endpoint_name,
        ContentType="application/json",
        Body=json.dumps(
            {
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": 128,
                    "top_p": 0.9,
                    # "temperature": random.randfloat(0.7,1),
                    "temperature": 1,
                    "return_full_text": False,
                },
            }
        ),
        CustomAttributes="accept_eula=true",
    )
    result = json.loads(response["Body"].read().decode())[0]["generation"]
    print(result)
    parse = re.search(r"{\n(.*?)}", result, re.DOTALL).group(0)
    print("--------------------------------------------")
    print(parse)
    return parse


def MCQ(event, context):
    # user_id = event["id"]
    # materials = event["materials"]
    # course_id =event["course"]
    r3 = []
    object_key = user_id+"/"+course_id+"/materials/"+materials+".txt"
#object_key = 'UOB-CERN-Success.mp4.txt'

# Retrieve the object
    # for object_key in object_keys:
    response = s3.get_object(Bucket=TEXT_BUCKET, Key=object_key)
    topic = response['Body'].read().decode('utf-8')
    r3.extend(filter(topic))
    topic = r3[random.randint(0,len(r3)-1)]
    print()
    prompt = """
    Human: i want you to generate 1 MCQ question about  this :
    Cristiano Ronaldo dos Santos Aveiro:  born 5 February 1985), better known as Ronaldo, is a Portuguese professional footballer who plays as a forward. He is the captain of the Portuguese national team and he is currently playing at Saudi Arabian football club Al Nassr.
    He is considered to be one of the greatest footballers of all time, and, by some, as the greatest ever.
    Ronaldo began his professional career with Sporting CP at age 17 in 2002, and signed for Manchester United a year later. He won three back-to-back Premier League titles: in 2006-07, 2007-08, and 2008-09. In 2007-08, Ronaldo, helped United win the UEFA Champions League. In 2008-09, he won his first FIFA Club World Cup in December 2008, and he also won his first Ballon d'Or. At one point Ronaldo was the most expensive professional footballer of all time, after moving from Manchester United to Real Madrid for approximately £80 m in July 2009

    The output should be a code snippet formatted in the following schema with only one correct answer:
    {
      "question": string // the question
      "choices": string // an array containg all the choices of the question, with only one correct choice, the others should be wrong
      "correct_answer_index": string // the index of the correct choice assuming 0-indexing
    }
    Assistant:
    {
      "question": "what is Ronaldo's birthplace?",
      "choices": ["germany", "Portugal", "Spain", "England"],
      "correct_answer_index": 1
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
      "correct_answer_index": string // the index of the correct choice assuming 0-indexing
    }
    Assistant:
    {
      "question": "When was Apple the world's biggest company by market capitilization?",
      "choices": ["March 2023", "June 2023", "May 2023", "March 2022"],
      "correct_answer_index": 0
    }
   
    Human: i want you to generate 1 MCQ question about this : {{topic}}
    The output should be a code snippet formatted in the following schema with only one correct answer
    {
      "question": string // the question
      "choices": string // an array containg all the choices of the question, with only one correct choice, the others should be wrong
      "correct_answer_index": string // the index of the correct choice assuming 0-indexing
    }  
    Assistant:"""
    filter(topic)
    prompt = prompt.replace("{{topic}}", topic)
    json.loads(create(prompt))
        # prompt= prompt + json.dumps(ali ,indent=2) + "\nAssistant:" #test

    return  json.loads(create(prompt))


def TF(event, context):
    prompt = """
    Human: i want you to generate 1 TRUE or FALSE question about  this :
    Cristiano Ronaldo dos Santos Aveiro:  born 5 February 1985), better known as Ronaldo, is a Portuguese professional footballer who plays as a forward. He is the captain of the Portuguese national team and he is currently playing at Saudi Arabian football club Al Nassr.
    He is considered to be one of the greatest footballers of all time, and, by some, as the greatest ever.
    Ronaldo began his professional career with Sporting CP at age 17 in 2002, and signed for Manchester United a year later. He won three back-to-back Premier League titles: in 2006-07, 2007-08, and 2008-09. In 2007-08, Ronaldo, helped United win the UEFA Champions League. In 2008-09, he won his first FIFA Club World Cup in December 2008, and he also won his first Ballon d'Or. At one point Ronaldo was the most expensive professional footballer of all time, after moving from Manchester United to Real Madrid for approximately £80 m in July 2009

    The output should be a code snippet formatted in the following schema with only one correct answer:
    {
      "question": string // the true or false question
      "correct_answer": boolean // the answer of the question (either True or False)
    }
    Assistant:
    {
      "question": "Ronaldo is born in Spain",
      "correct_answer_index": false
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
      "correct_answer": boolean // the answer of the question (either True or False)
    }
    Assistant:
    {
      "question": "Steve jobs is one of the founders of Apple?",
      "correct_answer": true
    }
   
    Human: i want you to generate 1 TRUE or FAlSE question about this : {{topic}}
    The output should be a code snippet formatted in the following schema with only one correct answer
    {
      "question": string // the true or false question
      "correct_answer": boolean // the answer of the question (either True or False)
    }
    Assistant:"""
    questions = []
    prompt = prompt.replace("{{topic}}", topic)
    for index in range(int(number)):
        ali = create(prompt)
        questions.append(json.loads(ali))
        # prompt= prompt + json.dumps(ali ,indent=2) + "\nAssistant:" #test

    return questions


def fill_in_blank(event, context):
    number = event["number"]
    number = 4
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
      "correct_answer": "2008"
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
      "correct_answer": "American"
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
      "correct_answer": "on-demand"
    } 

    Human: i want you to generate 1 fill-in-the-blank question about this : {{topic}}

    The output should be a code snippet formatted in the following schema with one blank to be filled:
    {
      "question": string // the question with 1 blank to be filled
      "answer": string // the correct answer to fill the blank
    } 
    Assistant: """ 

    questions = []
    prompt = prompt.replace("{{topic}}", topic)
    for index in range(int(number)):
        ali = create(prompt)
        questions.append(json.loads(ali))
        # prompt= prompt + json.dumps(ali ,indent=2) + "\nAssistant:" #test

    return questions
import random
import math
def filter(text):
    words = text.split()
    cut_size =math.ceil(len(words) / 1000)
    cuts = []
    mergedcuts = []
    for i in range(0,len(words),math.ceil(len(words)/cut_size)):
      cuts.append(words[i:i+math.ceil((len(words)-1)/cut_size)])
    for item in cuts:
      mergedcuts.append(" ".join(item))
    return (mergedcuts)