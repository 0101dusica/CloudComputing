import json
import os
import uuid
import boto3
from botocore.exceptions import ClientError
import base64
from datetime import datetime

s3 = boto3.client('s3')
dynamodb = boto3.client('dynamodb')

def handler(event, context):
    try:
        body = json.loads(event['body'])
        file_name = body['fileName']
        file_content = base64.b64decode(body['fileContent'])
        metadata = body['metadata']
        bucket_name = os.environ['BUCKET_NAME']
        table_name = os.environ['TABLE_NAME']
        id = str(uuid.uuid4())

        # Upload file to S3
        s3.put_object(
            Bucket=bucket_name,
            Key=file_name,
            Body=file_content,
            Metadata=metadata
        )

        # Save metadata to DynamoDB
        dynamodb.put_item(
            TableName=table_name,
            Item={
                'id': {'S': id},
                'fileName': {'S': file_name},
                **{k: {'S': str(v)} for k, v in metadata.items()},
                'uploadDate': {'S': datetime.utcnow().isoformat()}
            }
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'File uploaded successfully', 'id': id})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Error uploading file', 'error': str(e)})
        }
