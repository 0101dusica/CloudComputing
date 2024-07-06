import json
import os

import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
def handler(event, context):
    try:
        body = json.loads(event['body'])
        user_id = body['user_id']

        table_name = os.environ['TABLE_NAME_MOVIE']
        table = dynamodb.Table(table_name)

        downloads_table_name = os.environ['TABLE_NAME_DOWNLOADS']
        downloads_table = dynamodb.Table(downloads_table_name)

        downloads_response = downloads_table.query(
            IndexName='ind-downloads',
            KeyConditionExpression=Key('user_id').eq(user_id)
        )

        downloads_results = downloads_response.get('Items', [])
        print(f"Downloads results: {downloads_results}")

        subscription_table_name = os.environ['TABLE_NAME_SUBSCRIPTION']
        subscription_table = dynamodb.Table(subscription_table_name)

        subscription_response = subscription_table.query(
            IndexName='ind-subscription',
            KeyConditionExpression=Key('user_id').eq(user_id)
        )

        subscription_results = subscription_response.get('Items', [])
        print(f"Subscription results: {subscription_results}")

        rating_table_name = os.environ['TABLE_NAME_RATING']
        rating_table = dynamodb.Table(rating_table_name)

        rating_response = rating_table.query(
            IndexName='ind-rating',
            KeyConditionExpression=Key('user_id').eq(user_id)
        )

        rating_results = rating_response.get('Items', [])
        print(f"Rating results: {rating_results}")



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