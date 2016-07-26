import gql from 'graphql-tag';
import createHash from 'sha.js';

const mutation = gql`
mutation login (
  $email: String!
  $password: String!
) {
  passportLoginEmail (
    email: $email
    password: $password
  ) {
    error
    token
  }
}
`;

const extensionMethods = {

  async loginWithEmail(email, password) {
    this.loginStart();

    const result = await this.apolloClient.mutate({
      mutation,
      variables: {
        email,
        password: createHash('sha256').update(password).digest('hex')
      }
    });

    this.loginComplete(result, 'passportLoginEmail');
  },

  signupWithEmail(email, password) {

  }

};

class LocalStrategy {

  constructor(apolloPassport) {
    this.ap = apolloPassport;
    apolloPassport.extendWith(extensionMethods);
  }

}

export default LocalStrategy;
