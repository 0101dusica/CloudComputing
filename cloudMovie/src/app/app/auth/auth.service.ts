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

  register(firstName: string, lastName: string, dobDate: Date, email: string, password: string, type: boolean, callback: (err: any, result: any) => void): void {
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
    const dataUserType = {
      Name: 'type',
      Value: type ? 'admin' : 'basic'
    };
  
    const attributeEmail = new CognitoUserAttribute(dataEmail);
    const attributeFirstName = new CognitoUserAttribute(dataFirstName);
    const attributeLastName = new CognitoUserAttribute(dataLastName);
    const attributeDOB = new CognitoUserAttribute(dataDOB);
    const attributeUserType = new CognitoUserAttribute(dataUserType);
  
    attributeList.push(attributeEmail);
    attributeList.push(attributeFirstName);
    attributeList.push(attributeLastName);
    attributeList.push(attributeDOB);
    attributeList.push(attributeUserType);
  
    userPool.signUp(email, password, attributeList, [], callback);
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
