import base64
import json
import os
import boto3
from botocore.exceptions import ClientError

s3 = boto3.client('s3')

def handler(event, context):
    try:
        file_name = event['queryStringParameters']['fileName']
        bucket_name = os.environ['BUCKET_NAME']
        
        s3_params = {
            'Bucket': bucket_name,
            'Key': file_name
        }
        
        response = s3.get_object(**s3_params)
        content_type = response['ContentType']
        content = response['Body'].read()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': content_type,
                'Content-Disposition': f'attachment; filename={file_name}'
            },
            'body': base64.b64encode(content).decode('utf-8'),
            'isBase64Encoded': True
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Error downloading file', 'error': str(e)})
        }
