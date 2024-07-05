import json
import os
import uuid

import boto3


dynamodb = boto3.resource('dynamodb')


def handler(event, context):
    try:
        body = json.loads(event['body'])

        user_id = body['user_id']
        movie_id = body['movie_id']
        rate = body['rate']

        # rating = Rating(user_id=user_id, movie_id=movie_id, rate=rate)

        table_name = os.environ['TABLE_NAME_RATING']

        dynamodb.Table(table_name).put_item(
            TableName=table_name,
            Item={
                "id": int(uuid.uuid4()),
                "user_id": user_id,
                "movie_id": movie_id,
                "rate": rate
            }
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps("rating")
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
