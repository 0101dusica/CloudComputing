import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import path = require('path');
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CloudProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket
    const movieBucket = new s3.Bucket(this, "idMovieBucket", {
      bucketName: "cloud-project-movie-bucket",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      versioned: true
    });

    // DynamoDB Table
    const moviesTable = new Table(this, 'MoviesTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      tableName: 'cloud-project-movie-table',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Lambda function to upload a short film
    const uploadLambda = new lambda.Function(this, 'upload', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'upload.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        BUCKET_NAME: movieBucket.bucketName,
        TABLE_NAME: moviesTable.tableName
      }
    });

    // Grant permissions to the upload lambda
    movieBucket.grantReadWrite(uploadLambda);
    moviesTable.grantFullAccess(uploadLambda);

    // Lambda function to download a short film
    const downloadLambda = new lambda.Function(this, 'download', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'download.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        BUCKET_NAME: movieBucket.bucketName,
      }
    });

    // Grant permissions to the download lambda
    movieBucket.grantRead(downloadLambda);
    // API Gateway

    const api = new apigateway.RestApi(this, 'moviesApi', {
      restApiName: 'Movies Service'
    });

    // Integrate upload lambda with API Gateway
    const uploadIntegration = new apigateway.LambdaIntegration(uploadLambda);
    api.root.addResource('upload').addMethod('POST', uploadIntegration);

    // Integrate download lambda with API Gateway
    const downloadIntegration = new apigateway.LambdaIntegration(downloadLambda);
    api.root.addResource('download').addMethod('GET', downloadIntegration);
  }
}

