import json
import os
import jwt
import requests
import boto3
import logging

# Postavite nivo logovanja za prikazivanje svih poruka
logger = logging.getLogger()
logger.setLevel(logging.INFO)

mapGroupsToPaths = [
    {"path": "GET /movies", "groups": ["admin", "user"]},
    {"path": "POST /upload", "groups": ["admin"]},
    {"path": "GET /view/{movieId}", "groups": ["admin", "user"]},
    {"path": "POST /search", "groups": ["admin", "user"]},
    {"path": "GET /episodes/{seriesId}", "groups": ["admin", "user"]},
    {"path": "GET /download/{movieId}", "groups": ["user"]},
    {"path": "DELETE /movies/{movieId}", "groups": ["admin"]},
    {"path": "POST /rate-movie", "groups": ["user"]},
    {"path": "POST /subscribe", "groups": ["user"]},
    {"path": "POST /unsubscribe", "groups": ["user"]},
    {"path": "GET /subscriptions", "groups": ["user"]},
]

def generate_policy(principal_id):
    return {
        "isAuthorized": True,
        "context": {"user": principal_id},
    }

def handler(event, context):
    logger.info("Received event: " + json.dumps(event))
    print(json.dumps(event))
    
    request_path = f"{event['httpMethod']} {event['resource']}"
    logger.info(f"Requested path: {request_path}")
    
    existing_paths = [config["path"] for config in mapGroupsToPaths]
    if request_path not in existing_paths:
        logger.warning("Requested path is not in allowed paths.")
        return {
            "statusCode": 403,
            "isAuthorized": False,
            "body": json.dumps({"message": "Invalid path"}),
        }

    auth_header = event["headers"].get("authorization")
    if not auth_header:
        logger.warning("No authorization header found.")
        return {
            "statusCode": 401,
            "isAuthorized": False,
            "body": json.dumps({"message": "No authorization header found"}),
        }

    token = auth_header.split(" ")[1]

    user_pool_id = os.environ["USER_POOL_ID"]
    region = boto3.Session().region_name  # Get the current region
    jwks_url = f"https://cognito-idp.{region}.amazonaws.com/{user_pool_id}/.well-known/jwks.json"
    jwks = requests.get(jwks_url).json()

    try:
        header = jwt.get_unverified_header(token)
        key = next(
            key
            for key in jwks["keys"]
            if key["kid"] == header["kid"]
        )

        public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(key))
        payload = jwt.decode(token, public_key, algorithms=["RS256"], audience=os.environ["CLIENT_ID"])
    except Exception as e:
        logger.error(f"Error decoding JWT token: {e}")
        return {
            "statusCode": 401,
            "isAuthorized": False,
            "body": json.dumps({"message": "Invalid token"}),
        }

    matching_path_config = next(config for config in mapGroupsToPaths if request_path == config["path"])
    user_groups = payload["cognito:groups"]
    logger.info(f"User groups from token: {user_groups}")
    
    if any(group in matching_path_config["groups"] for group in user_groups):
        logger.info("User is authorized.")
        return generate_policy(payload["sub"])

    logger.warning("User is not authorized.")
    return {
        "statusCode": 403,
        "isAuthorized": False,
        "body": json.dumps({"message": "User not authorized"}),
    }
