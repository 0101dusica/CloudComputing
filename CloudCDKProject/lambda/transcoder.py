import json
import boto3
import os
import subprocess

s3 = boto3.client('s3')
bucket_name = os.environ['BUCKET_NAME']


def handler(event, context):
    print("usaoooooo")
    # for record in event['Records']:
    #     message = json.loads(record['body'])
    #     video_key = message['movie_id']
    #
    #     download_path = f'/tmp/{video_key}'
    #     upload_path_low = f'/tmp/low_{video_key}'
    #     upload_path_mid = f'/tmp/mid_{video_key}'
    #     upload_path_high = f'/tmp/high_{video_key}'
    #
    #     try:
    #         s3.download_file(bucket_name, video_key, download_path)
    #
    #         # Transcoding using ffmpeg
    #         subprocess.run(['ffmpeg', '-i', download_path, '-s', '640x360', upload_path_low])
    #         subprocess.run(['ffmpeg', '-i', download_path, '-s', '1280x720', upload_path_mid])
    #         subprocess.run(['ffmpeg', '-i', download_path, '-s', '1920x1080', upload_path_high])
    #
    #         # Upload transcoded files back to S3
    #         s3.upload_file(upload_path_low, bucket_name, f'low_{video_key}')
    #         s3.upload_file(upload_path_mid, bucket_name, f'mid_{video_key}')
    #         s3.upload_file(upload_path_high, bucket_name, f'high_{video_key}')

    print(f"Transcoding completed for ")
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(
            {'message': 'generated successfully'})
    }

        # except Exception as e:
        #     return {
        #         'statusCode': 500,
        #         'headers': {
        #             'Access-Control-Allow-Headers': 'Content-Type',
        #             'Access-Control-Allow-Origin': '*',
        #             'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        #         },
        #         'body': json.dumps({'message': 'Error uploading file', 'error': str(e)})
        #     }