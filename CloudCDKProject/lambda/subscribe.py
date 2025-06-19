import json
import os
import string
import uuid

import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')

sns = boto3.client('sns')


def handler(event, context):
    try:
        body = json.loads(event['body'])

        user_id = body['user_id']
        genres = body['genres']
        actors = body['actors']
        director = body['director']

        print(user_id)

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
            existing_arns = existing_item.get('arns', [])

            for genre in genres:
                if genre not in existing_genres:
                    existing_genres.append(genre)

                for subscription in existing_arns:
                    if genre != subscription['subscription_name']:
                        arn = subscribe_to_topic(genre, user_id)
                        existing_arns.append({'subscription_name': genre, 'arn': arn})

            for actor in actors:
                if actor not in existing_actors:
                    existing_actors.append(actor)

                for subscription in existing_arns:
                    if actor != subscription['subscription_name']:
                        arn = subscribe_to_topic(actor, user_id)
                        existing_arns.append({'subscription_name': actor, 'arn': arn})

            if director:
                if director not in existing_directors:
                    existing_directors.append(director)

                for subscription in existing_arns:
                    if director != subscription['subscription_name']:
                        arn = subscribe_to_topic(director, user_id)
                        existing_arns.append({'subscription_name': director, 'arn': arn})

            table.update_item(
                Key={
                    'id': existing_item['id'],
                    'user_id': user_id
                },
                UpdateExpression="SET genres = :genres, actors = :actors, directors = :directors, arns = :arns",
                ExpressionAttributeValues={
                    ':genres': existing_genres,
                    ':actors': existing_actors,
                    ':directors': existing_directors,
                    ':arns': existing_arns
                }
            )
        else:
            topic_arns = []
            if len(genres) > 0:
                for genre in genres:
                    arn = subscribe_to_topic(genre, user_id)
                    if (arn):
                        topic_arns.append({'subscription_name': genre, 'arn': arn})

            if len(actors) > 0:
                for actor in actors:
                    arn = subscribe_to_topic(actor, user_id)
                    if (arn):
                        topic_arns.append({'subscription_name': actor, 'arn': arn})

            if director:
                arn = subscribe_to_topic(director, user_id)
                if (arn):
                    topic_arns.append({'subscription_name': director, 'arn': arn})

            item = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "genres": genres,
                "actors": actors,
                "arns": topic_arns
            }
            if director:
                item["directors"] = [director]
            table.put_item(Item=item)


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


def subscribe_to_topic(subscribe_name: string, user_id: string):
    addition = "Topic"

    topic_name = subscribe_name.replace(' ', '') + addition
    topic_arn = None

    # List existing topics and check if the topic already exists
    try:
        response = sns.list_topics()
        topics = response['Topics']
        for topic in topics:
            if topic['TopicArn'].endswith(f":{topic_name}"):
                topic_arn = topic['TopicArn']
                break
    except Exception as e:
        print(f"Error listing topics: {e}")
        return None

    # If the topic does not exist, create it
    if not topic_arn:
        try:
            create_topic_response = sns.create_topic(Name=topic_name)
            topic_arn = create_topic_response['TopicArn']
        except Exception as e:
            print(f"Error creating topic: {e}")
            return None

    # Subscribe the user to the topic
    try:
        sns.subscribe(
            TopicArn=topic_arn,
            Protocol='email',
            Endpoint=user_id
        )
        return topic_arn
    except Exception as e:
        print(f"Error subscribing to topic: {e}")
        return None
