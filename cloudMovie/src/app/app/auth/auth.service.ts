// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { env } from '../../../env/env';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: env.cognito.userPoolId,
  ClientId: env.cognito.userPoolWebClientId
};

const userPool = new CognitoUserPool(poolData);

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  register(firstName: string, lastName: string, dobDate: Date, username: string,  email: string, password: string, callback: (err: any, result: any) => void): void {
    const attributeList = [];
  
    const dataEmail = {
      Name: 'email',
      Value: email
    };
    const dataFirstName = {
      Name: 'given_name',
      Value: firstName
    };
    const dataLastName = {
      Name: 'family_name',
      Value: lastName
    };
    const dataDOB = {
      Name: 'birthdate',
      Value: dobDate.toISOString().split('T')[0] // Formatted as YYYY-MM-DD
    };
  
    const attributeEmail = new CognitoUserAttribute(dataEmail);
    const attributeFirstName = new CognitoUserAttribute(dataFirstName);
    const attributeLastName = new CognitoUserAttribute(dataLastName);
    const attributeDOB = new CognitoUserAttribute(dataDOB);
  
    attributeList.push(attributeEmail);
    attributeList.push(attributeFirstName);
    attributeList.push(attributeLastName);
    attributeList.push(attributeDOB);
  
    userPool.signUp(username, password, attributeList, [], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        // If signup successful, store additional user data in DynamoDB
        const params = {
          TableName: 'user-table', // Replace with your DynamoDB table name
          Item: {
            username: username,
            firstName: firstName,
            lastName: lastName,
            dob: dobDate.toISOString(),
            userType: 'basic' // Default to basic user type
          }
        };
        callback(null, result);
      }
    });
  }
  

  authenticate(email: string, password: string, callback: (err: any, result: any) => void): void {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });

    const userData = {
      Username: email,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => callback(null, result),
      onFailure: (err) => callback(err, null)
    });
  }
}
