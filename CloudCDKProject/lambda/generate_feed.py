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
        results = []

        #Get criterion data
        get_tables_data(user_id)

        print(f"Movies results: {movies}")
        print(f"Downloads results: {user_downloads}")
        print(f"Subscription results: {user_subscriptions}")
        print(f"Rating results: {user_ratings}")



        for movie in movies:
            points = 0
            movie_id = movie['movieId']
            # print("MOVIE ID", movie_id)
            created_at = movie['createdAt']
            genres = movie['genres']
            actors = movie['actors']
            director = movie['director']

            #1 DOWNLOADS
            if len(user_downloads) > 0:
                downloads = user_downloads[0].get('downloads', [])

                for download in downloads:
                    genre = download['genre']
                    score = int(download['score'])
                    for movie_genre in genres:
                        if movie_genre.lower() == genre.lower():
                            points += 30*score


            #2 SUBSCRIPTIONS
            for subscription in user_subscriptions:
                subscription_genres = subscription.get('genres', [])
                genres_matches = list(set(genres).intersection(set(subscription_genres)))
                if len(genres_matches) > 0:
                    print("ZANROVA POKLOPLJENO ", len(genres_matches))
                    points += 10

                subscription_actors = subscription.get('actors', [])
                actors_matches = list(set(actors).intersection(set(subscription_actors)))
                if len(actors_matches) > 1:
                    print("GLUMACA POKLOPLJENO ", len(actors_matches))
                    points += 5

                if len(actors_matches) == 1:
                    points += 2

                subscription_directors = subscription.get('directors', [])
                # print(subscription_directors)
                if director.lower() in (d.lower() for d in subscription_directors):
                    # print("JEA")
                    points += 3

            #3 RATINGS
            for rating in user_ratings:
                if movie_id == rating['movieId']:
                    rate = int(rating['rate'])

                    if 0 < rate <= 2:
                        points += 1

                    if rate == 3:
                        points += 3

                    if 3 < rate <= 5:
                        points += 6

            # print(f"Movie {movie_id} points calculated: {points}")
            results.append({
                'movie_id': movie_id,
                'points': points,
                'created_at': created_at
            })

        results.sort(key=lambda x: x['points'], reverse=True)
        print(results)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                'Pragma': 'no-cache',
                'Expires': '0'
            },
            'body': json.dumps(results)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'message': 'ERROR', 'error': str(e)})
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
