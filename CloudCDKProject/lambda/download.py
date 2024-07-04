import boto3
import os
import json
from botocore.exceptions import ClientError

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')


def handler(event, context):
    # Metadata
    movie_id = event['pathParameters']['movieId']
    created_at = event['queryStringParameters'].get('createdAt')

    bucket_name = os.environ['BUCKET_NAME']  # S3 bcuket

    try:
        # Generate presigned URL for get file from S3
        presigned_url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': movie_id},
            ExpiresIn=3600
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'presigned_url': presigned_url, 'id': movie_id})
        }
    except ClientError as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'error': str(e)})
        }
