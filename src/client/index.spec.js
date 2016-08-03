import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import 'regenerator-runtime/runtime';

import LocalStrategy, { hashPassword } from './index';

const should = chai.should();
chai.use(sinonChai);

describe('apollo-passport-local - client', () => {

  const ap = {
    apolloClient: {},
    extendWith(obj) {
      for (var key in obj)
        this[key] = obj[key];
    }
  };

  it('createUserEmailPassword()', async () => {
    ap.loginStart = sinon.spy();
    ap.loginComplete = sinon.spy();
    ap.apolloClient.mutate = sinon.spy(() => "result");

    new LocalStrategy(ap);
    await ap.createUserEmailPassword('email', 'password');

    ap.loginStart.should.have.been.calledBefore(ap.apolloClient);
    ap.apolloClient.mutate.should.have.been.calledWithMatch({
      variables: {
        email: 'email',
        password: hashPassword('password')
      }
    });
    ap.loginComplete.should.have.been.calledAfter(ap.apolloClient.mutate);
    ap.loginComplete.should.have.been.calledWith("result", "apCreateUserEmailPassword");
  });

  it('loginWithEmailPassword()', async () => {
    ap.loginStart = sinon.spy();
    ap.loginComplete = sinon.spy();
    ap.apolloClient.mutate = sinon.spy(() => "result");

    new LocalStrategy(ap);
    await ap.loginWithEmailPassword('email', 'password');

    ap.loginStart.should.have.been.calledBefore(ap.apolloClient);
    ap.apolloClient.mutate.should.have.been.calledWithMatch({
      variables: {
        email: 'email',
        password: hashPassword('password')
      }
    });
    ap.loginComplete.should.have.been.calledAfter(ap.apolloClient.mutate);
    ap.loginComplete.should.have.been.calledWith("result", "apLoginEmailPassword");
  });

  it('updateUserPassword()', async () => {
    ap.apolloClient.mutate = sinon.spy(() => "result");

    new LocalStrategy(ap);
    const result = await ap.updateUserPassword('userId', 'oldPass', 'newPass');

    ap.apolloClient.mutate.should.have.been.calledWithMatch({
      variables: {
        userId: 'userId',
        oldPassword: hashPassword('oldPass'),
        newPassword: hashPassword('newPass')
      }
    });
    result.should.equal("result");
  });

});
