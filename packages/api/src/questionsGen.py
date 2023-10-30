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

response = s3.get_object(Bucket=TEXT_BUCKET, Key=object_key)


def create(prompt):
    # parameters needed,
    # type : the type of question MCQ
    # text : course_id
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
    result = json.loads(response["Body"].read().decode())
    print(result)


def MCQ(event, context):
    number = event["number"]
    number = 2
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
    create(prompt)
    create(prompt)
