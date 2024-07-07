import { Injectable } from '@angular/core';
import { env } from '../../../env/env'; // Ensure this path is correct based on your project structure
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
  CognitoIdToken
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
  username: string | undefined;
  role: string | undefined;

  constructor() {}

  // Method to update user information
  setUser(username: string, role: string) {
    this.username = username;
    this.role = role;
  }

  register(firstName: string, lastName: string, dobDate: Date, username: string, email: string, password: string, callback: (err: any, result: any) => void): void {
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
  
    userPool.signUp(username, password, attributeList, [], callback);
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
      onSuccess: (session: CognitoUserSession) => {
        // Extract and store username and role
        const idToken = session.getIdToken();
        const username = idToken.payload['cognito:username'];
        let role = 'user'; // Default role if cognito:groups is not present
        
        if (idToken.payload['cognito:groups']) {
          const userRoles = idToken.payload['cognito:groups'];
          role = userRoles.includes('admin') ? 'admin' : 'user'; // Assuming 'admin' and 'user' groups exist
        }
        
        this.setUser(username, role); // Store in service
  
        callback(null, session);
      },
      onFailure: (err) => callback(err, null)
    });
  }
}
