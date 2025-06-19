import json
import os

import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['TABLE_NAME_SUBSCRIPTION']


def handler(event, context):
    try:
        user_id = event['queryStringParameters'].get('user_id')

        table = dynamodb.Table(table_name)

        response = table.query(
            IndexName='ind-subscription',
            KeyConditionExpression=Key('user_id').eq(user_id)
        )

        subscriptions = response.get('Items', [])
        print(f"Subscriptions result: {subscriptions}")

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET'
            },
            'body': json.dumps(subscriptions)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET'
            },
            'body': json.dumps({'message': 'Error retrieving movies', 'error': str(e)})
        }
