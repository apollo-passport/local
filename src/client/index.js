import gql from 'graphql-tag';
import createHash from 'sha.js';

function hashPassword(plaintext) {
  return createHash('sha256').update(plaintext).digest('hex');
}

const mutation = {
  createUserEmailPassword: gql`
    mutation login (
      $email: String!
      $password: String!
    ) {
      apCreateUserEmailPassword (
        email: $email
        password: $password
      ) {
        error
        token
      }
    }
  `,

  loginWithEmailPassword: gql`
    mutation login (
      $email: String!
      $password: String!
    ) {
      apLoginEmailPassword (
        email: $email
        password: $password
      ) {
        error
        token
      }
    }
  `,

  setUserPassword: gql`
    mutation login (
      $userId: String!
      $password: String!
    ) {
      apSetUserPassword (
        userId: $userId
        password: $password
      ) {
        error
        token
      }
    }
  `
};

const extensionMethods = {

  async createUserEmailPassword(email, password) {
    this.loginStart();

    const result = await this.apolloClient.mutate({
      mutation: mutation.createUserEmailPassword,
      variables: {
        email,
        password: hashPassword(password)
      }
    });

    this.loginComplete(result, 'apCreateUserEmailPassword');
  },

  async loginWithEmailPassword(email, password) {
    this.loginStart();

    const result = await this.apolloClient.mutate({
      mutation: mutation.loginWithEmailPassword,
      variables: {
        email,
        password: hashPassword(password)
      }
    });

    this.loginComplete(result, 'apLoginEmailPassword');
  },

  // what status updates should this get?
  // that logic could also be used for re-requesting additional permissions on services
  async updateUserPassword(userId, oldPassword, newPassword) {
    const result = await this.apolloClient.mutate({
      mutation: mutation.loginWithEmail,
      variables: {
        userId,
        oldPassword: hashPassword(oldPassword),
        newPassword: hashPassword(newPassword)
      }
    });

    console.log(result);
  }

};

class LocalStrategy {

  constructor(apolloPassport) {
    this.ap = apolloPassport;
    apolloPassport.extendWith(extensionMethods);
  }

}

export default LocalStrategy;
