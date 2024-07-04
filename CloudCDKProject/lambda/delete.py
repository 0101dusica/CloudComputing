import json
import os
import boto3
from boto3.dynamodb.conditions import Key

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')


def handler(event, context):
    try:
        # Metadata
        movie_id = event['pathParameters']['movieId']
        created_at = event['queryStringParameters'].get('createdAt')

        bucket_name = os.environ['BUCKET_NAME']  # S3 bcuket
        table_name = os.environ['TABLE_NAME_MOVIE']  # DynamoDB
        table = dynamodb.Table(table_name)

        # Get a unique identifier for the movie
        movie_id = event['pathParameters']['movieId']  # Identifier for DynamoDB and S3 bucket

        key_condition = Key('movieId').eq(movie_id) & Key('createdAt').eq(created_at)
        response = table.query(KeyConditionExpression=key_condition)

        if len(response['Items']) == 0 or 'Items' not in response:
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,DELETE'
                },
                'body': json.dumps({'error': 'Movie not found'})
            }

        movie_item = response['Items'][0]  # mozda ne mora?
        movie_id = movie_item['movieId']

        # Delete movie file from S3
        s3.delete_object(Bucket=bucket_name, Key=movie_id)

        # Delete movie metadata from DynamoDB
        table.delete_item(
            Key={
                'movieId': movie_id,
                'createdAt': created_at
            }
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET, DELETE'
            },
            'body': json.dumps({'message': 'Deleted successfully', 'id': movie_id})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET, DELETE'
            },
            'body': json.dumps({'message': 'Error deleting file', 'error': str(e)})
        }
