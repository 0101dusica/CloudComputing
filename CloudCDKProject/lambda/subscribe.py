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
        genres = body['genres']
        actors = body['actors']
        director = body['director']

        table_name = os.environ['TABLE_NAME_SUBSCRIPTION']
        table = dynamodb.Table(table_name)

        # Query to find the existing item for the user_id
        response = table.query(
            IndexName='ind-subscription',
            KeyConditionExpression=Key('user_id').eq(user_id)
        )

        items = response.get('Items', [])
        print(f"QueryResult: {items}")

        if len(items) > 0:
            existing_item = items[0]
            existing_genres = existing_item.get('genres', [])
            existing_actors = existing_item.get('actors', [])
            existing_directors = existing_item.get('directors', [])

            for genre in genres:
                if genre not in existing_genres:
                    existing_genres.append(genre)

            for actor in actors:
                if actor not in existing_actors:
                    existing_actors.append(actor)

            if director not in existing_directors:
                existing_directors.append(director)

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
        else:
            table.put_item(
                Item={
                    "id": str(uuid.uuid4()),
                    "user_id": user_id,
                    "genres": genres,
                    "actors": actors,
                    "directors": [director]
                }
            )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps("subscribe successful")
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
