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
        rate = body['rate']

        table_name = os.environ['TABLE_NAME_RATING']
        table = dynamodb.Table(table_name)

        response = table.query(
            IndexName='ind-rating',
            KeyConditionExpression=Key('user_id').eq(user_id) & Key('movieId').eq(movie_id)
        )

        results = response.get('Items', [])
        print(f"Query results: {results}")

        if len(results) > 0:
            # If item exists, update the existing item
            item = results[0]  # Get the first item from the results
            previous_rate = item.get('rate', None)  # Get the previous rate
            print(f"Previous rate: {previous_rate}")

            # Update the existing item with the new rate
            table.update_item(
                Key={
                    'id': item['id'],
                    'movieId': movie_id
                },
                UpdateExpression='SET #r = :rate',
                ExpressionAttributeNames={
                    '#r': 'rate'
                },
                ExpressionAttributeValues={
                    ':rate': str(rate)
                }
            )
        else:
            # If item does not exist, create a new item
            table.put_item(
                Item={
                    "id": str(uuid.uuid4()),
                    "user_id": user_id,
                    "movieId": movie_id,
                    "rate": str(rate)
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
