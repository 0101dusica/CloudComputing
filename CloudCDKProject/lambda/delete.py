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

        bucket_name = os.environ['BUCKET_NAME']  # S3 bucket
        table_name_movie = os.environ['TABLE_NAME_MOVIE']  # DynamoDB Movie Table
        table_name_genre = os.environ['TABLE_NAME_GENRE']  # DynamoDB Genre Table
        table_name_actor = os.environ['TABLE_NAME_ACTOR']  # DynamoDB Actor Table
        table_name_episode = os.environ['TABLE_NAME_EPISODE']

        table_movie = dynamodb.Table(table_name_movie)
        table_genre = dynamodb.Table(table_name_genre)
        table_actor = dynamodb.Table(table_name_actor)
        table_episode = dynamodb.Table(table_name_episode)

        # Get movie item
        key_condition = Key('movieId').eq(movie_id) & Key('createdAt').eq(created_at)
        key_condition_episode = Key('episodeId').eq(movie_id) & Key('createdAt').eq(created_at)

        response_from_movie = table_movie.query(KeyConditionExpression=key_condition)
        response_from_episode = table_episode.query(KeyConditionExpression=key_condition_episode)

        if len(response_from_movie['Items']) == 0 and len(response_from_episode['Items']) == 0:
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,DELETE'
                },
                'body': json.dumps({'error': 'Movie or episode not found'})
            }

        # Delete movie file from S3
        s3.delete_object(Bucket=bucket_name, Key=movie_id)

        if len(response_from_movie['Items']) != 0:
            # Delete movie metadata from DynamoDB
            table_movie.delete_item(
                Key={
                    'movieId': movie_id,
                    'createdAt': created_at
                }
            )

            # Delete related genres
            delete_related_items(table_genre, movie_id, 'genre')

            # Delete related actors
            delete_related_items(table_actor, movie_id, 'actor')

            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET, DELETE'
                },
                'body': json.dumps({'message': 'Deleted successfully', 'id': movie_id})
            }

        if len(response_from_episode['Items']) != 0:
            # Delete movie metadata from DynamoDB
            table_episode.delete_item(
                Key={
                    'episodeId': movie_id,
                    'createdAt': created_at
                }
            )


            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET, DELETE'
                },
                'body': json.dumps({'message': 'Deleted successfully', 'id': movie_id})
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET, DELETE'
            },
            'body': json.dumps({'message': 'Error deleting file', 'error': str(e)})
        }


def delete_related_items(table, movie_id, attribute_name):
    scan_response = table.scan(
        FilterExpression=Key('movieId').eq(movie_id)
    )
    items = scan_response['Items']

    for item in items:
        table.delete_item(
            Key={
                'movieId': movie_id,
                attribute_name: item[attribute_name]
            }
        )
