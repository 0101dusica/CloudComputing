import json
import os
import uuid
import boto3
from botocore.exceptions import ClientError
import base64
from datetime import datetime

s3 = boto3.client('s3')


def handler(event, context):
    try:
        bucket_name = os.environ['BUCKET_NAME']  # S3 bucket

        # Get a unique identifier for the movie
        movie_id = event['pathParameters']['movieId']  # Identifier for DynamoDB and S3 bucket

        # Generate presigned URL for get file from S3
        presigned_url = s3.generate_presigned_url('get_object', Params={'Bucket': bucket_name, 'Key': movie_id},
                                                  ExpiresIn=3600)

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps(
                {'message': 'Pre-signed URL generated successfully', 'presignedUrl': presigned_url, 'id': movie_id})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'message': 'Error view file', 'error': str(e)})
        }
