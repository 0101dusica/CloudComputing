import json
import os
import boto3
from boto3.dynamodb.conditions import Key, Attr

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')


def handler(event, context):
    try:
        series_id = event['pathParameters']['seriesId']
        print(series_id, "sid")
        if not series_id:
            return {
                'statusCode': 400,
                'body': json.dumps('seriesId parameter is required')
            }

        table_name = os.environ.get('TABLE_NAME_EPISODE')
        print(table_name)
        if not table_name:
            return {
                'statusCode': 500,
                'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                'body': json.dumps('TABLE_NAME_EPISODE environment variable not set')
            }

        table = dynamodb.Table(table_name)

        try:
            # Use scan instead of query
            response = table.scan(
                FilterExpression=Attr('seriesId').eq(series_id)
            )

            episodes = response['Items']
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                'body': json.dumps(episodes)
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                'body': json.dumps(f'Failed to scan DynamoDB: {str(e)}')
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps(f'Internal Server Error: {str(e)}')
        }
