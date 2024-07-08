import uuid

import boto3
import os
import json

from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')


def handler(event, context):
    # Metadata
    movie_id = event['pathParameters']['movieId']
    body = json.loads(event['body'])
    user_id = body['user_id']
    genres = body['genres']  # List of genres

    bucket_name = os.environ['BUCKET_NAME']  # S3 bucket

    table_name = os.environ['TABLE_NAME_DOWNLOADS']
    table = dynamodb.Table(table_name)

    # Query to find existing items for the user
    response = table.query(
        IndexName='ind-downloads',
        KeyConditionExpression=Key('user_id').eq(user_id)
    )

    results = response.get('Items', [])
    print(f"Query results: {results}")

    if len(results) > 0:
        existing_item = results[0]
        existing_downloads = existing_item.get('downloads', [])

        # Update or add genres
        updated_downloads = []
        genres_set = set(genres)
        for download in existing_downloads:
            if download['genre'] in genres_set:
                download['score'] = str(int(download['score']) + 1)
                genres_set.remove(download['genre'])  # Remove from set once found and updated
            updated_downloads.append(download)

        # Add any new genres
        for genre in genres_set:
            updated_downloads.append({'genre': genre, 'score': '1'})

        table.update_item(
            Key={
                'id': existing_item['id'],
                'user_id': user_id,
            },
            UpdateExpression="SET downloads = :downloads",
            ExpressionAttributeValues={
                ':downloads': updated_downloads,
            }
        )
    else:
        # Create a new item if no existing item for the user
        initial_downloads = [{'genre': genre, 'score': "1"} for genre in genres]

        table.put_item(
            Item={
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "downloads": initial_downloads,
            }
        )

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


