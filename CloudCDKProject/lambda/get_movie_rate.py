import json
import os
import uuid

import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')


def handler(event, context):
    try:
        body = json.loads(event['body'])

        user_id = body['user_id']
        movie_id = body['movie_id']

        table_name = os.environ['TABLE_NAME_RATING']
        table = dynamodb.Table(table_name)

        response = table.query(
            IndexName='ind-rating',
            KeyConditionExpression=Key('user_id').eq(user_id) & Key('movieId').eq(movie_id)
        )

        results = response.get('Items', [])
        print(f"Query results: {results}")

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps(results[0])
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'message': 'Error get movie rate', 'error': str(e)})
        }