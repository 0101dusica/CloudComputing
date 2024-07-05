import json
import os

import boto3

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['TABLE_NAME_MOVIE']  # Ovde postavi ime tabele iz env varijable

def handler(event, context):
    try:
        # Dohvati sve filmove iz DynamoDB tabele
        table = dynamodb.Table(table_name)
        response = table.scan()

        # Pripremi rezultat za vracanje
        movies = response['Items']
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET'
            },
            'body': json.dumps(movies)
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
