import json
import os
import boto3

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

table_name_movie = os.environ['TABLE_NAME_MOVIE']
table_name_actor = os.environ['TABLE_NAME_ACTOR']
table_name_genre = os.environ['TABLE_NAME_GENRE']


def handler(event, context):
    try:
        body = json.loads(event['body'])

        title = body.get('title')
        description = body.get('description')
        actors = body.get('actors')
        director = body.get('director')
        genres = body.get('genres')
        duration = body.get('duration')

        result = query(title=title, director=director, genres=genres, actors=actors, description=description)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps(result)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'message': 'Error search', 'error': str(e)})
        }


def query(title=None, director=None, genres=None, actors=None, description=None):
    table = dynamodb.Table(table_name_movie)

    params = {
        'TableName': table_name_movie,
    }

    key_condition_expression = ''
    filter_expressions = []
    expression_attribute_values = {}

    # Query based on genre and actors
    if genres and actors:
        items = query_movies_by_genre_and_actors(genres, actors)
    elif genres:
        items = query_movies_by_attribute('genre', genres)
    elif actors:
        items = query_movies_by_attribute('actors', actors)
    else:
        items = []

    # Adding additional search conditions if provided
    if title:
        add_search_condition(params, key_condition_expression, filter_expressions, expression_attribute_values, 'title',
                             title)
    if director:
        add_search_condition(params, key_condition_expression, filter_expressions, expression_attribute_values,
                             'director', director)
    if description:
        add_search_condition(params, key_condition_expression, filter_expressions, expression_attribute_values,
                             'description', description, contains=True)

    # If no basic conditions and no items from genre/actors query, raise an error
    if not key_condition_expression and not filter_expressions and not items:
        raise ValueError("At least one search criteria must be provided.")

    if key_condition_expression:
        params['KeyConditionExpression'] = key_condition_expression
        params['ExpressionAttributeValues'] = expression_attribute_values
    if filter_expressions:
        params['FilterExpression'] = ' AND '.join(filter_expressions)

    response = table.query(**params)

    if items:
        # Find intersection between items and response['Items']
        intersection_items = [item for item in items if item in response['Items']]
        items = intersection_items
    else:
        items = response['Items']

    return items


def add_search_condition(params, key_condition_expression, filter_expressions, expression_attribute_values, attribute,
                         value, contains=False):
    if key_condition_expression:
        filter_expressions.append(f"{'contains' if contains else '='}({attribute}, :{attribute})")
    else:
        key_condition_expression = f"{attribute} = :{attribute}"
    expression_attribute_values[f":{attribute}"] = value


def query_movies_by_attribute(attribute, value):
    if attribute == 'genre':
        table_name = table_name_genre
    else:
        table_name = table_name_actor
    table = dynamodb.Table(table_name)
    response = table.query(
        IndexName=f'{attribute}-index',
        KeyConditionExpression=f'{attribute} = :{attribute}',
        ExpressionAttributeValues={f':{attribute}': value}
    )
    movie_id_timestamps = [(item['movieId'], item['createdAt']) for item in response['Items']]
    return get_movies_by_ids(movie_id_timestamps)


def query_movies_by_genre_and_actors(genres, actors):
    genre_items = query_movies_by_attribute('genre', genres)
    actor_items = query_movies_by_attribute('actors', actors)
    genre_movie_ids = {item['movieId'] for item in genre_items}
    actor_movie_ids = {item['movieId'] for item in actor_items}
    intersection_movie_ids = genre_movie_ids.intersection(actor_movie_ids)
    intersection_items = [item for item in actor_items if item['movieId'] in intersection_movie_ids]
    return intersection_items


def get_movies_by_ids(movie_id_timestamps):
    table = dynamodb.Table(table_name_movie)
    items = []
    for movie_id, created_at in movie_id_timestamps:
        response = table.get_item(Key={'movieId': movie_id, 'createdAt': created_at})
        if 'Item' in response:
            items.append(response['Item'])
    return items
