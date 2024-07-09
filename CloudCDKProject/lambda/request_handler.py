import json
import boto3
import os

sqs = boto3.client('sqs')
queue_url = os.environ['QUEUE_URL']


def handler(event, context):
    try:
        body = json.loads(event['body'])
        movie_id = body['movie_id']  # movie_id koristi se kao video_key

        print('cao druze')
        # Stavljamo zadatak u SQS red
        response = sqs.send_message(
            QueueUrl=queue_url,
            MessageBody=json.dumps({'movie_id': movie_id})
        )

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'message': 'Transcoding request accepted', 'taskId': response['MessageId']})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'message': 'Error processing request', 'error': str(e)})
        }