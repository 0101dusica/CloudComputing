import boto3

def handler(event, context):
    client = boto3.client('cognito-idp')
    user_pool_id = event['userPoolId']
    user_name = event['userName']
    try:
        response = client.admin_add_user_to_group(
            UserPoolId=user_pool_id,
            Username=user_name,
            GroupName='user'
        )
        print(f"Successfully added user {user_name} to group 'user'.")
    except client.exceptions.UserNotFoundException:
        print(f"User {user_name} not found.")
    except client.exceptions.InvalidParameterException as e:
        print(f"Invalid parameter: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")
    return event
