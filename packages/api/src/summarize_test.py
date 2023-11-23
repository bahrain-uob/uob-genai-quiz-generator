import json
import os
import boto3
import re
endpoint_name = "jumpstart-dft-meta-textgeneration-llama-2-13b-f"  # need to make environ
sm_client = boto3.client("sagemaker-runtime")
S3 = boto3.client("s3")
topic = """
Amazon S3 or Amazon Simple Storage Service is a service offered by Amazon Web Services (AWS) that provides object storage through a web service interface.[1][2] Amazon S3 uses the same scalable storage infrastructure that Amazon.com uses to run its e-commerce network.[3] Amazon S3 can store any type of object, which allows uses like storage for Internet applications, backups, disaster recovery, data archives, data lakes for analytics, and hybrid cloud storage. AWS launched Amazon S3 in the United States on March 14, 2006,[1][4] then in Europe in November 2007.[5]
Amazon S3 manages data with an object storage architecture[6] which aims to provide scalability, high availability, and low latency with high durability.[3] The basic storage units of Amazon S3 are objects which are organized into buckets. Each object is identified by a unique, user-assigned key.[7] Buckets can be managed using the console provided by Amazon S3, programmatically with the AWS SDK, or the REST application programming interface. Objects can be up to five terabytes in size.[8][9] Requests are authorized using an access control list associated with each object bucket and support versioning[10] which is disabled by default.[11] Since buckets are typically the size of an entire file system mount in other systems, this access control scheme is very coarse-grained. In other words, unique access controls cannot be associated with individual files.[citation needed] Amazon S3 can be used to replace static web-hosting infrastructure with HTTP client-accessible objects,[12] index document support, and error document support.[13] The Amazon AWS authentication mechanism allows the creation of authenticated URLs, valid for a specified amount of time. Every item in a bucket can also be served as a BitTorrent feed. The Amazon S3 store can act as a seed host for a torrent and any BitTorrent client can retrieve the file. This can drastically reduce the bandwidth cost for the download of popular objects. A bucket can be configured to save HTTP log information to a sibling bucket; this can be used in data mining operations.[14] There are various User Mode File System (FUSE)–based file systems for Unix-like operating systems (for example, Linux) that can be used to mount an S3 bucket as a file system. The semantics of the Amazon S3 file system are not that of a POSIX file system, so the file system may not behave entirely as expected.[15]
"""
# topic ="""
# The rapid advancement of artificial intelligence (AI) has brought about significant changes in various industries. AI technology, with its ability to process vast amounts of data and perform complex tasks, has revolutionized sectors such as healthcare, finance, and transportation. In healthcare, AI helps in diagnosing diseases, analyzing medical images, and personalizing treatment plans. In finance, AI algorithms assist in fraud detection, risk assessment, and investment management. In transportation, AI plays a crucial role in autonomous vehicles, traffic optimization, and predictive maintenance. The widespread adoption of AI has improved efficiency, accuracy, and decision-making across these industries, paving the way for further advancements and opportunities.
# """


def summarize(event, context):
  
    prompt= """
              Write a summary of the following text delimited by triple backticks. Return your response which covers the key points of the text.
              ```{{topic}}```
    """
#     prompt = """
 
# Prompt : Your task is to generate a detailed summary of about 250 words of the text delimited by triple backticks
#  ```{{topic}}```.
#    Summary:
# """
#     prompt = """
#               Write a summary of the following text delimited by triple backticks. Return your response which covers the key points of the text.
#               ```  The proliferation of social media has transformed communication and networking. Platforms like Facebook, Twitter, and Instagram have connected people from diverse backgrounds, facilitated information sharing, and empowered individuals to express themselves. Social media has also played a significant role in mobilizing social movements, raising awareness about important causes, and fostering online communities. However, concerns regarding data privacy, online harassment, and the spread of misinformation remain prevalent. It is essential to strike a balance between the benefits and challenges of social media to harness its potential while addressing its drawbacks.```
              
#               SUMMARY: Social media has transformed communication, but concerns about privacy, harassment, and misinformation persist.

#                 Write a summary of the following text delimited by triple backticks. Return your response which covers the key points of the text.
#               ```{{topic}}```
#               SUMMARY:

# """
    prompt= prompt.replace("{{topic}}",topic)

    response = sm_client.invoke_endpoint(
        EndpointName=endpoint_name,
        ContentType="application/json",
        Body=json.dumps(
            {
                "inputs": [[{"role" : "user", "content" : prompt}]],
                "parameters": {
                    "max_new_tokens": 512,
                    "top_p": 0.9,
                    # "temperature": random.randfloat(0.7,1),
                    "temperature": 0.7,
                    "return_full_text": False,
                },
            }
        ),
        CustomAttributes="accept_eula=true",
    )
    result = json.loads(response["Body"].read().decode())[0]["generation"]["content"]
    print(result)
    parse = re.search(r"```\n(.*?)```", result, re.DOTALL).group(1)
    print(parse)
    return parse