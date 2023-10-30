import json
import os
import boto3

# endpoint_name = os.environ["LLAMA_2_13B_ENDPOINT"]
endpoint_name = "jumpstart-dft-meta-textgeneration-llama-2-13b"  # need to make environ
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
response = s3.get_object(Bucket=TEXT_BUCKET, Key=object_key)
import re

number = 2


def create(prompt):
    # parameters needed,
    # type : the type of question MCQ
    # text : object key
    # number : number of questions
    # id : for fetching the material

    response = sm_client.invoke_endpoint(
        EndpointName=endpoint_name,
        ContentType="application/json",
        Body=json.dumps(
            {
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": 128,
                    "top_p": 0.9,
                    "temperature": 0.7,
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
    number = event["number"]
    # topic = event["key"]
    prompt = """
    Human: i want you to generate 1 MCQ question about Albert Einestein
    The output should be a code snippet formatted in the following schema with only one correct answer:
    {
      "question": string // the question
      "choices": string // an array containg all the choices of the question, with only one correct choice, the others should be wrong
      "correct_answer_index": string // the index of the correct choice assuming 0-indexing
    }
    Assistant:
    {
      "question": "What is Albert Einstein's most famous equation?",
      "choices": ["F=ma", "G=Tc^3", "E=mc^2", "a=b/c"],
      "correct_answer_index": 2
    }
    Human: i want you to generate 1 MCQ question about python
    The output should be a code snippet formatted in the following schema with only one correct answer
    {
      "question": string // the question
      "choices": string // an array containg all the choices of the question, with only one correct choice, the others should be wrong
      "correct_answer_index": string // the index of the correct choice assuming 0-indexing
    }
    Assistant:
    {
      "question": "What is the correct syntax to print a string in Python?",
      "choices": ["print('string')", "print \"string\"", "printf('string')", "console.log('string')"],
      "correct_answer_index": 0  
    }
    
    Human: i want you to generate 1 MCQ question about {{topic}}
    The output should be a code snippet formatted in the following schema with only one correct answer
    {
      "question": string // the question
      "choices": string // an array containg all the choices of the question, with only one correct choice, the others should be wrong
      "correct_answer_index": string // the index of the correct choice assuming 0-indexing
    }
    Assistant:"""

    prompt = prompt.replace("{{topic}}", topic)
    for index in range(number):
        ali = create(prompt)
        # prompt= prompt + json.dumps(ali ,indent=2) + "\nAssistant:" #test


def TF(event, context):
    number = event["number"]
    prompt = """
    Human: i want you to generate 1 true or false question about Albert Einestein
    The output should be a code snippet formatted in the following schema with only one correct answer:
    {
      "question": string // the question
      "correct_answer": string // the index of the correct choice assuming 0-indexing
    }
    Assistant:
    {
      "question": " is Albert Einstein's most famous equation E=mc^2 ?",
      "correct_answer": "True"
    }
    Human: i want you to generate 1 true or false question about python
    The output should be a code snippet formatted in the following schema with only one correct answer
    {
      "question": string // the question
      "correct_answer": string // the index of the correct choice assuming 0-indexing
    }
    Assistant:
    {
      "question": " is the correct syntax to print a string in Python console.log('string')",
      "correct_answer": False   
    }
    Human: i want you to generate 1 MCQ question about {{topic}}
    The output should be a code snippet formatted in the following schema with only one correct answer
    {
      "question": string // the question
      "choices": string // an array containg all the choices of the question, with only one correct choice, the others should be wrong
      "correct_answer_index": string // the index of the correct choice assuming 0-indexing
    }
    Assistant:"""

    prompt = prompt.replace("{{topic}}", topic)
    for index in range(number):
        create(prompt)


def fill_in_blank(event, context):
    number = event["number"]
    prompt = """
    Human: i want you to generate 1 true or false question about Albert Einestein
    The output should be a code snippet formatted in the following schema with only one correct answer:
    {
      "question": string // the question
      "correct_answer": string // the index of the correct choice assuming 0-indexing
    }
    Assistant:
    {
      "question": " is Albert Einstein's most famous equation E=mc^2 ?",
      "correct_answer": "True"
    }
    Human: i want you to generate 1 true or false question about python
    The output should be a code snippet formatted in the following schema with only one correct answer
    {
      "question": string // the question
      "correct_answer": string // the index of the correct choice assuming 0-indexing
    }
    Assistant:
    {
      "question": " is the correct syntax to print a string in Python console.log('string')",
      "correct_answer": False   
    }
    Human: i want you to generate 1 MCQ question about {{topic}}
    The output should be a code snippet formatted in the following schema with only one correct answer
    {
      "question": string // the question
      "choices": string // an array containg all the choices of the question, with only one correct choice, the others should be wrong
      "correct_answer_index": string // the index of the correct choice assuming 0-indexing
    }
    Assistant:"""

    prompt = prompt.replace("{{topic}}", topic)
    for index in range(number):
        create(prompt)
