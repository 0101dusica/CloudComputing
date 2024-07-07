import json
import os
import uuid

import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')

movies = []
user_downloads = []
user_subscriptions = []
user_ratings = []


def handler(event, context):
    try:
        body = json.loads(event['body'])
        user_id = body['user_id']

        #Get FEED TABLE
        table_name = os.environ['TABLE_NAME_FEED']
        table = dynamodb.Table(table_name)

        #Get criterion data
        get_tables_data(user_id)

        print(f"Movies results: {movies}")
        print(f"Downloads results: {user_downloads}")
        print(f"Subscription results: {user_subscriptions}")
        print(f"Rating results: {user_ratings}")

        for movie in movies:
            points = 0
            movie_id = movie['movieId']
            genres = movie['genres']
            actors = movie['actors']
            director = movie['director']

            #1 DOWNLOADS
            for download in user_downloads:
                downloads = download.get('downloads', [])

                if movie_id in downloads:
                    points += 30
                    put_movie_in_feed(user_id, movie_id, points)

            #2 SUBSCRIPTIONS
            for subscription in user_subscriptions:
                subscription_genres = subscription.get('genres', [])
                genres_matches = list(set(genres).intersection(set(subscription_genres)))
                if len(genres_matches) > 0:
                    points += 10

                subscription_actors = subscription.get('actors', [])
                actors_matches = list(set(actors).intersection(set(subscription_actors)))
                if len(actors_matches) > 1:
                    points += 5

                if len(actors_matches) == 1:
                    points += 2

                subscription_directors = subscription.get('director', [])
                if director in subscription_directors:
                    points += 3

            #3 RATINGS
            for rating in user_ratings:
                if movie_id == rating['movieId']:
                    rate = rating['rate']

                    if 0 < rate <= 2:
                        points += 1

                    if rate == 3:
                        points += 3

                    if 3 < rate <= 5:
                        points += 6

            put_movie_in_feed(user_id, movie_id, points)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps("successful load feed page!")
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


def get_tables_data(user_id):
    global movies, user_downloads, user_subscriptions, user_ratings

    table_name = os.environ['TABLE_NAME_MOVIE']
    table = dynamodb.Table(table_name)

    response = table.scan()
    movies = response.get('Items', [])

    downloads_table_name = os.environ['TABLE_NAME_DOWNLOADS']
    downloads_table = dynamodb.Table(downloads_table_name)

    downloads_response = downloads_table.query(
        IndexName='ind-downloads',
        KeyConditionExpression=Key('user_id').eq(user_id)
    )

    user_downloads = downloads_response.get('Items', [])

    subscription_table_name = os.environ['TABLE_NAME_SUBSCRIPTION']
    subscription_table = dynamodb.Table(subscription_table_name)

    subscription_response = subscription_table.query(
        IndexName='ind-subscription',
        KeyConditionExpression=Key('user_id').eq(user_id)
    )

    user_subscriptions = subscription_response.get('Items', [])

    rating_table_name = os.environ['TABLE_NAME_RATING']
    rating_table = dynamodb.Table(rating_table_name)

    rating_response = rating_table.query(
        IndexName='ind-rating',
        KeyConditionExpression=Key('user_id').eq(user_id)
    )

    user_ratings = rating_response.get('Items', [])


def put_movie_in_feed(table, user_id, movie_id, points):
    table.put_item(
        Item={
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "movieId": movie_id,
            "points": points
        }
    )
