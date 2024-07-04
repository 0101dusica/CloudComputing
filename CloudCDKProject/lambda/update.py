import json
import os
import uuid
import boto3
from botocore.exceptions import ClientError
import base64
from datetime import datetime

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')


def handler(event, context):
    try:
        body = json.loads(event['body'])

        # Metadata
        file_name = body['fileName']
        content_type = body['contentType']
        file_size = body['fileSize']
        created_at = event['queryStringParameters'].get('createdAt')  # get created date
        updated_at = datetime.utcnow().isoformat()

        # Data defined by admin
        title = body['title']
        description = body['description']
        actors = body['actors']
        director = body['director']
        genres = body['genres']
        duration = body['duration']
        # image = body['image'] ??

        bucket_name = os.environ['BUCKET_NAME']  # S3 bcuket
        table_name = os.environ['TABLE_NAME_MOVIE']  # DynamoDB

        # Get a unique identifier for the movie
        movie_id = event['pathParameters']['movieId']  # Identifier for DynamoDB and S3 bucket

        # Generate presigned URL for upload file to S3
        if body['content']:
            presigned_url = s3.generate_presigned_url(
                'put_object',
                Params={'Bucket': bucket_name, 'Key': movie_id},
                ExpiresIn=3600
            )
        else:
            presigned_url = ''

        # Save metadata to DynamoDB
        dynamodb.Table(table_name).put_item(
            TableName=table_name,
            Item={
                'movieId': movie_id,
                'fileName': file_name,
                'contentType': content_type,
                "fileSize": file_size,
                'createdAt': created_at,
                'updatedAt': updated_at,
                'title': title,
                'description': description,
                'actors': actors,
                'director': director,
                'genres': genres,
                'duration': duration,

            }
        )

        return {
            'statusCode': 200,
            'headers': {
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
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'message': 'Error uploading file', 'error': str(e)})
        }
