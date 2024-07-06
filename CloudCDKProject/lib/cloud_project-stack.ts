import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs/lib/construct';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import path = require('path');
import { AttributeType,ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';

// import * as sqs from 'aws-cdk-lib/aws-sqs';


// import * as sqs from 'aws-cdk-lib/aws-sqs';

import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';  // Uvezite Effect ovde

import iam from "aws-cdk-lib/aws-iam";

export class CloudProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket
    const movieBucket = new s3.Bucket(this, "MovieBucket", {
      bucketName: "cloud-project-movie-bucket",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      versioned: true,
      cors: [
        {
          allowedHeaders: ["*"],
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.DELETE,
          ],
          allowedOrigins: ["http://localhost:4201"],
          exposedHeaders: ["ETag"],
          maxAge: 3000,
        },
      ],
    });


    //                **************** DynamoDB TABLES ***************** //

    // DynamoDB Table MOVIE
    const moviesTable = new Table(this, 'MoviesTable', {
      partitionKey: { name: 'movieId', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.STRING },
      tableName: 'cloud-project-movie-table',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    moviesTable.addGlobalSecondaryIndex({
      indexName: 'ind-title',
      partitionKey: { name: 'title', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    moviesTable.addGlobalSecondaryIndex({
      indexName: 'ind-description',
      partitionKey: { name: 'description', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    moviesTable.addGlobalSecondaryIndex({
      indexName: 'ind-director',
      partitionKey: { name: 'director', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    moviesTable.addGlobalSecondaryIndex({
      indexName: 'ind-duration',
      partitionKey: { name: 'duration', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });
   
   
    // DynamoDB Table ACTOR
    const actorsTable = new Table(this, 'ActorsTable', {
      partitionKey: { name: 'movieId', type: AttributeType.STRING },
      sortKey: { name: 'actor', type: AttributeType.STRING },
      tableName: 'cloud-project-actor-table',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    actorsTable.addGlobalSecondaryIndex({
      indexName: 'ind-actor',
      partitionKey: { name: 'actor', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    // DynamoDB Table GENRE
    const genresTable = new Table(this, 'GenresTable', {
      partitionKey: { name: 'movieId', type: AttributeType.STRING },
      sortKey: { name: 'genre', type: AttributeType.STRING },
      tableName: 'cloud-project-genre-table',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    genresTable.addGlobalSecondaryIndex({
      indexName: 'ind-genre',
      partitionKey: { name: 'genre', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    const ratingsTable = new Table(this, 'RatingsTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      sortKey: { name: 'movieId', type: AttributeType.STRING },
      tableName: "cloud-project-rating-table",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    ratingsTable.addGlobalSecondaryIndex({
      indexName: 'ind-rating',
      partitionKey: { name: 'user_id', type: AttributeType.STRING },
      sortKey: { name: 'movieId', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    const subscriptionTable = new Table(this, 'SubscriptionTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      sortKey: { name: 'user_id', type: AttributeType.STRING },
      tableName: "cloud-project-subscription-table",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    //jos interatctions, feed
    //                **************** LAMBDA ***************** //

    // Lambda function to UPLOAD a short film
    const uploadLambda = new lambda.Function(this, 'upload', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'upload.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        BUCKET_NAME: movieBucket.bucketName,
        TABLE_NAME_MOVIE: moviesTable.tableName,
        TABLE_NAME_ACTOR: actorsTable.tableName,
        TABLE_NAME_GENRE: genresTable.tableName
      }
    });

    movieBucket.grantPut(uploadLambda);
    moviesTable.grantWriteData(uploadLambda);
    actorsTable.grantWriteData(uploadLambda);
    genresTable.grantWriteData(uploadLambda);

    // Lambda function to GET all movies
    const getMoviesLambda = new lambda.Function(this, 'getMovies', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'get_movies.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        TABLE_NAME_MOVIE: moviesTable.tableName,
      }
    });

    // Grant permissions to read from DynamoDB table
    moviesTable.grantReadData(getMoviesLambda);


    // Lambda function to GET a movie by ID
    const getMovieByIdLambda = new lambda.Function(this, 'getMovieById', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'get_movie_by_id.handler', // Promeniti na stvarni handler naziv
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        TABLE_NAME_MOVIE: moviesTable.tableName,
      }
    });

    // Grant permissions to read from DynamoDB table
    moviesTable.grantReadData(getMovieByIdLambda);

     // Lambda function to UPDATE a short film
     const updateLambda = new lambda.Function(this, 'update', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'update.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        BUCKET_NAME: movieBucket.bucketName,
        TABLE_NAME_MOVIE: moviesTable.tableName,
        TABLE_NAME_ACTOR: actorsTable.tableName,
        TABLE_NAME_GENRE: genresTable.tableName
      }
    });

    movieBucket.grantPut(updateLambda);
    moviesTable.grantWriteData(updateLambda);
    actorsTable.grantWriteData(updateLambda);
    genresTable.grantWriteData(updateLambda);

     // Lambda function to VIEW a short film
     const viewLambda = new lambda.Function(this, 'view', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'view.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        BUCKET_NAME: movieBucket.bucketName
      }
    });

    movieBucket.grantRead(viewLambda);
    
    // Lambda function to DOWNLOAD a short film
    const downloadLambda = new lambda.Function(this, 'download', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'download.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        BUCKET_NAME: movieBucket.bucketName,
      }
    });

    movieBucket.grantRead(downloadLambda);

     // Lambda function to DELETE a short film
     const deleteLambda = new lambda.Function(this, 'delete', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'delete.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        BUCKET_NAME: movieBucket.bucketName,
        TABLE_NAME_MOVIE: moviesTable.tableName,
        TABLE_NAME_ACTOR: actorsTable.tableName,
        TABLE_NAME_GENRE: genresTable.tableName
      }
    });

     const dynamoDBPolicy = new PolicyStatement({
  effect: Effect.ALLOW,
  actions: [
    'dynamodb:Query',
    'dynamodb:Scan',
    'dynamodb:GetItem',
    'dynamodb:PutItem',
    'dynamodb:UpdateItem',
    'dynamodb:DeleteItem',
  ],
  resources: [
    moviesTable.tableArn,
    `${moviesTable.tableArn}/index/*`,
    actorsTable.tableArn,
    `${actorsTable.tableArn}/index/*`,
    genresTable.tableArn,
    `${genresTable.tableArn}/index/*`,
  ],
});


deleteLambda.addToRolePolicy(dynamoDBPolicy);

    movieBucket.grantReadWrite(deleteLambda);
    movieBucket.grantDelete(deleteLambda)
    moviesTable.grantWriteData(deleteLambda);
    actorsTable.grantWriteData(deleteLambda);
    genresTable.grantWriteData(deleteLambda);


    // Lambda function to rate a film
    const ratingLambda = new lambda.Function(this, 'rating', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'rate_movie.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        TABLE_NAME_RATING:  ratingsTable.tableName,
      }
    });
    ratingsTable.grantReadWriteData(ratingLambda);

    // Lambda function to subscribe to the film
    const subscribeLambda = new lambda.Function(this, 'subscription', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'subscribe.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        TABLE_NAME_SUBSCRIPTION:  subscriptionTable.tableName,
      }
    });
    subscriptionTable.grantReadWriteData(subscribeLambda);

     // Lambda function to SEARCH a short film
     const searchLambda = new lambda.Function(this, 'search', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'search.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        TABLE_NAME_MOVIE: moviesTable.tableName,
        TABLE_NAME_ACTOR: actorsTable.tableName,
        TABLE_NAME_GENRE: genresTable.tableName
      }
    });

    moviesTable.grantReadData(searchLambda);
    actorsTable.grantReadData(searchLambda);
    genresTable.grantReadData(searchLambda);

    searchLambda.addToRolePolicy(dynamoDBPolicy)

    // const seacrhPolicy = new PolicyStatement({
    //   effect: iam.Effect.ALLOW,
    //   actions: ['dynamodb:Query'],
    //   resources: [
    //     moviesTable.tableArn,
    //     `${moviesTable.tableArn}/index/ind-title`,
    //     `${moviesTable.tableArn}/index/ind-description`,
    //     `${moviesTable.tableArn}/index/ind-director`,
    //     `${moviesTable.tableArn}/index/ind-duration`,
    //     genresTable.tableArn,
    //     actorsTable.tableArn,
    //      `${actorsTable.tableArn}/index/ind-actor`,
    //     `${genresTable.tableArn}/index/ind-genre`      ],
    // });
    //
    // searchLambda.addToRolePolicy(seacrhPolicy);

    //                **************** API GATEWAY ***************** //

    const api = new apigateway.RestApi(this, 'moviesApi', {
      restApiName: 'Movies Service'
    });

    // Integrate upload lambda with API Gateway
    const uploadIntegration = new apigateway.LambdaIntegration(uploadLambda);
    api.root.addResource('upload').addMethod('POST', uploadIntegration);

    const getMoviesIntegration = new apigateway.LambdaIntegration(getMoviesLambda);
    const moviesResource = api.root.addResource('movies');
    moviesResource.addMethod('GET', getMoviesIntegration);

    // Integrate getMovieById lambda with API Gateway
    const getMovieByIdIntegration = new apigateway.LambdaIntegration(getMovieByIdLambda);
    const deleteIntegration = new apigateway.LambdaIntegration(deleteLambda)
    const movieByIdResource = moviesResource.addResource('{movieId}');
    movieByIdResource.addMethod('GET', getMovieByIdIntegration);
    movieByIdResource.addMethod('DELETE',deleteIntegration)


    // Integrate viewLambda with API Gateway
    const viewIntegration = new apigateway.LambdaIntegration(viewLambda);
    const viewResource = api.root.addResource('view');
    viewResource.addResource('{movieId}').addMethod('GET', viewIntegration);

     // Integrisanje searchLambda sa API Gateway-om
    const searchIntegration = new apigateway.LambdaIntegration(searchLambda);
    const searchResource = api.root.addResource('search');
    searchResource.addMethod('POST', searchIntegration);


    // Integrate download lambda with API Gateway
    const downloadIntegration = new apigateway.LambdaIntegration(downloadLambda);
    api.root.addResource('download').addResource('{movieId}').addMethod('GET', downloadIntegration);

    // Integrate rate_movie lambda with API Gateway
    const ratingIntegration = new apigateway.LambdaIntegration(ratingLambda);
    api.root.addResource('rate-movie').addMethod('POST', ratingIntegration);

    // Integrate subscribe lambda with API Gateway
    const subscriptionIntegration = new apigateway.LambdaIntegration(subscribeLambda);
    api.root.addResource('subscribe').addMethod('POST', subscriptionIntegration);
  }
}

