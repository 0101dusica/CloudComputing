import json
import os
import boto3
from boto3.dynamodb.conditions import Key, Attr

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

def handler(event, context):
    try:
        series_id = event.get('queryStringParameters', {}).get('seriesId')
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
                'body': json.dumps('TABLE_NAME_EPISODE environment variable not set')
            }

        table = dynamodb.Table(table_name)

        try:
            response = table.query(
                IndexName='ind-series',
                KeyConditionExpression=Key('seriesId').eq(series_id)
            )

            episodes = response['Items']
            return {
                'statusCode': 200,
                'body': json.dumps(episodes)
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'body': json.dumps(f'Failed to query DynamoDB: {str(e)}')
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Internal Server Error: {str(e)}')
        }
