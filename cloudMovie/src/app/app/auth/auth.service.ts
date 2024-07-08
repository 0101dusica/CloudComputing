import { Injectable } from '@angular/core';
import { env } from '../../../env/env';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
  CognitoIdToken,
  ISignUpResult
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

  setUser(username: string, role: string) {
    this.username = username;
    this.role = role;
  }

  register(
    firstName: string,
    lastName: string,
    dobDate: Date,
    username: string,
    email: string,
    password: string,
    callback: (err: Error | undefined, result: ISignUpResult | undefined) => void
  ): void {
    const attributeList: CognitoUserAttribute[] = [];
  
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
  
    userPool.signUp(username, password, attributeList, [], (err, result) => callback(err, result));
  }

  authenticate(
    email: string,
    password: string,
    callback: (err: Error | null, result: CognitoUserSession | null) => void
  ): void {
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

  isAuthenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
          if (err || !session) {
            resolve(false);
          } else {
            resolve(session.isValid());
          }
        });
      } else {
        resolve(false);
      }
    });
  }

  getUserRole(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.role) {
        resolve(this.role);
      } else {
        const cognitoUser = userPool.getCurrentUser();
        if (cognitoUser) {
          cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
            if (err || !session) {
              resolve('user');
            } else {
              const idToken = session.getIdToken();
              let role = 'user';
              if (idToken.payload['cognito:groups']) {
                const userRoles = idToken.payload['cognito:groups'];
                role = userRoles.includes('admin') ? 'admin' : 'user';
              }
              this.setUser(idToken.payload['cognito:username'], role);
              resolve(role);
            }
          });
        } else {
          resolve('user');
        }
      }
    });
  }

  logout(): void {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
    this.username = undefined;
    this.role = undefined;
  }
}
