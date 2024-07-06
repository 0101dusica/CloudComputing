import json
import os

import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')


def handler(event, context):
    try:
        body = json.loads(event['body'])

        user_id = body['user_id']
        subscription_name = body['subscription_name']

        table_name = os.environ['TABLE_NAME_SUBSCRIPTION']
        table = dynamodb.Table(table_name)

        # Query to find the existing item for the user_id
        response = table.query(
            IndexName='ind-subscription',
            KeyConditionExpression=Key('user_id').eq(user_id)
        )

        results = response.get('Items', [])
        # print(f"Query results: {results}")

        if len(results) > 0:
            existing_item = results[0]
            existing_genres = existing_item.get('genres', [])
            existing_actors = existing_item.get('actors', [])
            existing_directors = existing_item.get('directors', [])

            found = False

            if subscription_name in existing_genres:
                existing_genres.remove(subscription_name)
                found = True

            if subscription_name in existing_actors:
                existing_actors.remove(subscription_name)
                found = True

            if subscription_name in existing_directors:
                existing_directors.remove(subscription_name)
                found = True

            if not found:
                return not_found_handler()

            table.update_item(
                Key={
                    'id': existing_item['id'],
                    'user_id': user_id
                },
                UpdateExpression="SET genres = :genres, actors = :actors, directors = :directors",
                ExpressionAttributeValues={
                    ':genres': existing_genres,
                    ':actors': existing_actors,
                    ':directors': existing_directors
                }
            )

            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                'body': json.dumps("Subscription deleted successfully")
            }

        else:
            return not_found_handler()

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


def not_found_handler():
    return {
        'statusCode': 404,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps("User subscription not found")
    }
