import json
import os
import boto3

endpoint_name = "jumpstart-dft-meta-textgeneration-llama-2-13b"  # need to make environ
sm_client = boto3.client("sagemaker-runtime")
S3 = boto3.client("s3")
topicbig = """
Amazon S3 or Amazon Simple Storage Service is a service offered by Amazon Web Services (AWS) that provides object storage through a web service interface.[1][2] Amazon S3 uses the same scalable storage infrastructure that Amazon.com uses to run its e-commerce network.[3] Amazon S3 can store any type of object, which allows uses like storage for Internet applications, backups, disaster recovery, data archives, data lakes for analytics, and hybrid cloud storage. AWS launched Amazon S3 in the United States on March 14, 2006,[1][4] then in Europe in November 2007.[5]
Amazon S3 manages data with an object storage architecture[6] which aims to provide scalability, high availability, and low latency with high durability.[3] The basic storage units of Amazon S3 are objects which are organized into buckets. Each object is identified by a unique, user-assigned key.[7] Buckets can be managed using the console provided by Amazon S3, programmatically with the AWS SDK, or the REST application programming interface. Objects can be up to five terabytes in size.[8][9] Requests are authorized using an access control list associated with each object bucket and support versioning[10] which is disabled by default.[11] Since buckets are typically the size of an entire file system mount in other systems, this access control scheme is very coarse-grained. In other words, unique access controls cannot be associated with individual files.[citation needed] Amazon S3 can be used to replace static web-hosting infrastructure with HTTP client-accessible objects,[12] index document support, and error document support.[13] The Amazon AWS authentication mechanism allows the creation of authenticated URLs, valid for a specified amount of time. Every item in a bucket can also be served as a BitTorrent feed. The Amazon S3 store can act as a seed host for a torrent and any BitTorrent client can retrieve the file. This can drastically reduce the bandwidth cost for the download of popular objects. A bucket can be configured to save HTTP log information to a sibling bucket; this can be used in data mining operations.[14] There are various User Mode File System (FUSE)–based file systems for Unix-like operating systems (for example, Linux) that can be used to mount an S3 bucket as a file system. The semantics of the Amazon S3 file system are not that of a POSIX file system, so the file system may not behave entirely as expected.[15]
"""

MATERIAL_BUCKET = os.environ["MATERIAL_BUCKET"]

def summarize(event, context):
    bucket_name = event["Records"][0]["s3"]["bucket"]["name"]
    object_key = event["Records"][0]["s3"]["object"]["key"]
    response = S3.get_object(Bucket=bucket_name, Key=object_key)
    topic = response["Body"].read().decode("utf-8")
    prompt= """
              Write a summary of the following text delimited by triple backticks.
              Return your response which covers the key points of the text, in a paragraph style. Make sure to shorten the text by covering only the key points.
              ```{{topic}}```
              SUMMARY:
    """
    prompt= prompt.replace("{{topic}}",topicbig)
    response = sm_client.invoke_endpoint(
        EndpointName=endpoint_name,
        ContentType="application/json",
        Body=json.dumps(
            {
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": 512,
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
    response = S3.put_object(
            Body=result, Bucket=MATERIAL_BUCKET, Key=object_key.removesuffix(".txt") + ".summary"
        )