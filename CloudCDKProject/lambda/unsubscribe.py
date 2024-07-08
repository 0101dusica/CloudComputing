import json
import os

import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
sns = boto3.client('sns')


def handler(event, context):
    try:
        body = json.loads(event['body'])

        user_id = body['user_id']
        print(user_id)
        subscription_name = body['subscription_name']
        print(subscription_name)

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
            print(existing_genres)
            existing_actors = existing_item.get('actors', [])
            print(existing_actors)
            existing_directors = existing_item.get('directors', [])
            print(existing_directors)
            existing_arns = existing_item.get('arns', [])
            print(existing_arns)

            to_remove = []

            for subscription in existing_arns:
                if subscription_name == subscription['subscription_name']:
                    arn = subscription['arn']
                    subscription_arn = get_subscription_arn_by_email(arn, user_id)

                    if subscription_arn == "PendingConfirmation":
                        break
                    if subscription_arn:
                        sns.unsubscribe(
                            SubscriptionArn=subscription_arn
                        )
                    to_remove.append(subscription)

            for subscription in to_remove:
                existing_arns.remove(subscription)

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


def get_subscription_arn_by_email(topic_arn, email):
    next_token = None

    while True:
        try:
            if next_token:
                response = sns.list_subscriptions_by_topic(
                    TopicArn=topic_arn,
                    NextToken=next_token
                )
            else:
                response = sns.list_subscriptions_by_topic(
                    TopicArn=topic_arn
                )

            for subscription in response.get('Subscriptions', []):
                if subscription['Endpoint'] == email:
                    return subscription.get('SubscriptionArn')

            next_token = response.get('NextToken')

            if not next_token:
                break
        except Exception as e:
            print(f"Error listing subscriptions: {e}")
            return None

    return None
