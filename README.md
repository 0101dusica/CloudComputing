# Cloud-Native Movie Streaming Application

## Overview
This project demonstrates a cloud-native architecture for a movie streaming application using AWS services. The architecture is designed to be scalable, secure, and cost-effective, leveraging various AWS managed services to handle different aspects of the application.

## Architecture
The application follows a microservices architecture, with each service performing a specific function within the system. Key AWS services used include:

- **API Gateway**: Acts as the entry point for all client requests.
- **AWS Lambda**: Handles the business logic for different functionalities such as user registration, login, adding content, searching content, getting content details, rating content, and subscribing users.
- **Amazon DynamoDB**: Serves as the database for storing user interaction history.
- **Amazon Cognito**: Manages user authentication and authorization.
- **AWS Amplify**: Facilitates continuous deployment and integration with GitHub for the front-end application.
- **Amazon S3 and MediaConvert**: Used for storing and processing media content related to movies.
- **SNS and CloudWatch**: Provide notifications and monitoring capabilities.

### Detailed Component Breakdown
1. **Frontend**: Deployed using AWS Amplify, allowing seamless integration and continuous deployment from a GitHub repository.
2. **Authentication**: Managed by Amazon Cognito, providing secure authentication for users.
3. **Backend Functions**: Implemented using AWS Lambda, handling various functionalities.
4. **Database**: Amazon DynamoDB stores user interaction history.
5. **Media Storage and Processing**: Amazon S3 for storing media content and MediaConvert for transcoding.
6. **Routing**: Amazon Route 53 handles DNS routing.
7. **Monitoring & Notifications**: Amazon CloudWatch for monitoring and Amazon SNS for notifications.

## Lambda Functions
- `deleteContent`  (logs to `metadata` DynamoDB table)
- `viewContent`  (logs to `metadata` DynamoDB table)
- `rateContent`  (logs to `rate` DynamoDB table)
- `uploadMovie`  (logs to `metadata` DynamoDB table)
- `downloadMovie`  (logs to `metadata` DynamoDB table)
- `searchContent`  (logs to `metadata` DynamoDB table)
- `editContent`  (logs to `metadata` DynamoDB table)
- `saveUserInteraction` (logs to `interactionHistory` DynamoDB table)
- `getInteraction` (logs to `interactionHistory` DynamoDB table)
- `subscribe` (logs to `user` DynamoDB table)
- `unsubscribe` (logs to `user` DynamoDB table)
- `notify` (logs to `user` DynamoDB table)
- `transcodedContent`

## Team Members
- **SV 42/2021 Dušica Trbović**
- **SV 74/2021 Ana Poparić**
- **SV 78/2021 Vesna Vasić**

## Setup and Deployment
1. Clone the repository from GitHub.
2. Deploy the frontend using AWS Amplify Console.
3. Set up Amazon Cognito for user authentication.
4. Configure API Gateway to route requests to the respective Lambda functions.
5. Create DynamoDB tables for storing user interaction history.
6. Deploy Lambda functions for backend operations.
7. Store media content in Amazon S3 and set up MediaConvert for transcoding.
8. Monitor the application using CloudWatch and set up SNS for notifications.

## Prerequisites
- AWS Account
- Node.js
- AWS CLI configured with appropriate permissions
- GitHub repository for the front-end application

## Running Locally
To run the project locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/0101dusica/CloudComputing.git
    cd CloudComputing
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm start
    ```
