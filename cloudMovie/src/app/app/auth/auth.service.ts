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

  register(email: string, password: string, callback: (err: any, result: any) => void): void {
    const attributeList = [];
    const dataEmail = {
      Name: 'email',
      Value: email
    };

    const attributeEmail = new CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

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
