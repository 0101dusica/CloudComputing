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

        table_name = os.environ['TABLE_NAME_MOVIE']  # DynamoDB
        table = dynamodb.Table(table_name)

        table_name_E = os.environ['TABLE_NAME_EPISODE']  # DynamoDB
        table_e = dynamodb.Table(table_name_E)

        # Build query condition
        key_condition = Key('movieId').eq(movie_id) & Key('createdAt').eq(created_at)
        key_condition_e = Key('episodeId').eq(movie_id) & Key('createdAt').eq(created_at)

        response = table.query(KeyConditionExpression=key_condition)
        response_e = table_e.query(KeyConditionExpression=key_condition_e)


        print(len(response_e['Items']))
        if len(response['Items']) == 0 and len(response_e['Items']) == 0:
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,DELETE'
                },
                'body': json.dumps({'error': 'Movie not found'})
            }

        if(len(response['Items']) != 0):
            movie_item = response['Items'][0]  # Assuming only one item per query
        else:
            movie_item = response_e['Items'][0]  # Assuming only one item per query

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,DELETE'
            },
            'body': json.dumps(movie_item)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,DELETE'
            },
            'body': json.dumps({'message': 'Error retrieving movie', 'error': str(e)})
        }
