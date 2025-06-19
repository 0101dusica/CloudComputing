import json
import os
import uuid
import boto3
import base64

from datetime import datetime

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
sns = boto3.client('sns')


def handler(event, context):
    genres = []
    director = ''
    actors = []
    try:
        body = json.loads(event['body'])

        # Metadata
        file_name = body['fileName']
        content_type = body['contentType']
        file_size = body['fileSize']
        created_at = datetime.utcnow().isoformat()
        updated_at = datetime.utcnow().isoformat()

        # Data defined by admin
        title = body['title']
        description = body['description']
        duration = body['duration']
        movieType = body['type']
        movie_id = str(uuid.uuid4())  # Identifier for DynamoDB and S3 bucket

        bucket_name = os.environ['BUCKET_NAME']  # S3 bcuket
        table_name = os.environ['TABLE_NAME_MOVIE']  # DynamoDB
        table_name_genres = os.environ['TABLE_NAME_GENRE']
        table_name_actors = os.environ['TABLE_NAME_ACTOR']
        table_name_episodes = os.environ['TABLE_NAME_EPISODE']

        if movieType == "episode":
            season_number = body['seasonNumber']
            episode_number = body['episodeNumber']
            series_id = body['seriesId']

            dynamodb.Table(table_name_episodes).put_item(
                TableName=table_name_episodes,
                Item={
                    'episodeId': movie_id,
                    'fileName': file_name,
                    'contentType': content_type,
                    "fileSize": file_size,
                    'createdAt': created_at,
                    'updatedAt': updated_at,
                    'title': title,
                    'description': description,
                    'duration': duration,
                    'type': movieType,
                    'seasonNumber': season_number,
                    'episodeNumber': episode_number,
                    'seriesId': series_id
                }
            )
        else:

            actors = body['actors']
            director = body['director']
            genres = body['genres']
            number_of_seasons = body['numberOfSeasons']
            # Save metadata to DynamoDB
            dynamodb.Table(table_name).put_item(
                TableName=table_name,
                Item={
                    'movieId': movie_id,
                    'fileName': file_name,
                    'contentType': content_type,
                    "fileSize": file_size,
                    'createdAt': created_at,
                    'updatedAt': updated_at,
                    'title': title,
                    'description': description,
                    'actors': actors,
                    'director': director,
                    'genres': genres,
                    'duration': duration,
                    'type': movieType,
                    'numberOfSeasons': number_of_seasons
                }
            )

            insert_items(dynamodb.Table(table_name_genres), genres, movie_id, created_at, 'genre')
            insert_items(dynamodb.Table(table_name_actors), actors, movie_id, created_at, 'actor')

        # Generate presigned URL for upload file to S3
        if movieType != 'show':
            presigned_url = s3.generate_presigned_url('put_object', Params={'Bucket': bucket_name, 'Key': movie_id},
                                                      ExpiresIn=3600)
        else:
            presigned_url = ''

        message = f"New movie dropped!\n\nTitle: {title}\nGenres: {', '.join(genres)}\nDirector: {director}\nActors: {', '.join(actors)}"

        for genre in body['genres']:
            publish_topic_message(genre, message)

        for actor in body['actors']:
            publish_topic_message(actor, message)

        publish_topic_message(body['director'], message)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps(
                {'message': 'Pre-signed URL generated successfully', 'presignedUrl': presigned_url, 'id': movie_id})
        }
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


def insert_items(table, items, movie_id, created_at, attribute_name):
    for item in items:
        table.put_item(
            Item={
                'movieId': movie_id,
                attribute_name: item,
                'createdAt': created_at
            }
        )


def publish_topic_message(subscribe_name, message):
    # Generate the topic name
    name_for_topic = subscribe_name.replace(' ', '')
    addition = "Topic"

    topic_name = f"{name_for_topic}{addition}"
    print(topic_name)
    topic = None
    # Check if the topic exists
    try:
        topics = sns.list_topics()
        for t in topics['Topics']:
            if t['TopicArn'].endswith(f":{topic_name}"):
                topic = t
                break
        if topic:
            topic_arn = topic['TopicArn']
        else:
            topic_arn = None
    except Exception as e:
        print(f"Error listing topics: {e}")
        return None

    print(topic_arn)
    if not topic_arn:
        print("topicArn is null")
        return None

    # Publish to the topic
    try:
        sns.publish(
            TopicArn=topic_arn,
            Message=message,
            Subject="New Movie Release"
        )
    except Exception as e:
        print(f"Error publishing to topic: {e}")
        return None
