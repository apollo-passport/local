import ApolloPassport from 'apollo-passport/lib/client';
import LocalStrategy from './index';
import chai from 'chai';
import 'regenerator-runtime/runtime';

// dupes from apollo-passport; TODO factor out
global.window = global;
const localStorage = window.localStorage = {
  items: {},
  getItem: (name) => localStorage.items[name],
  setItem: (name, value) => localStorage.items[name] = value
//  removeItem: (name) => delete localStorage.items[name]
};
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
const decodedToken = {
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
};

const should = chai.should();

describe('ApolloPassport - strategies - local - client', () => {

  describe('loginWithEmailPassword()', () => {

    it('handles errors', (done) => {
      const apolloClient = {
        mutate() {
          return new Promise(resolve => {
            resolve({
              errors: [
                {
                  // think this is right, double check TODO
                  location: '',
                  message: 'an error'
                }
              ]
            });
          });
        }
      };

      const ap = new ApolloPassport({ apolloClient });
      ap.use('local', LocalStrategy);

      ap.loginWithEmailPassword('a', 'b').then(() => {
        // Nothing to test for for now.
        done();
      });
    });

    it('sets state', (done) => {
      const apolloClient = {
        mutate() {
          return new Promise(resolve => {
            resolve({
              data: {
                apLoginEmailPassword: { token }
              }
            });
          });
        }
      };

      const ap = new ApolloPassport({ apolloClient });
      ap.use('local', LocalStrategy);

      ap.loginWithEmailPassword('a', 'b').then(() => {
        ap.getState().should.deep.equal({
          data: decodedToken,
          verified: true,
          error: null
        });
        done();
      }).catch(err => console.log(err));

    });

  });

});
