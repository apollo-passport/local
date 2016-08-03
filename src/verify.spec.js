import chai from 'chai';
import chaiAsPromised from "chai-as-promised";

import 'regenerator-runtime/runtime';

import _verify from './verify';

chai.use(chaiAsPromised);
const should = chai.should();

describe('apollo-passport-local - verify', () => {

  const context = {};
  const verify = _verify.bind(context);

  const error = new Error('test error');

  let comparePasswordError = false;
  context.comparePassword = function(pass1, pass2, cb) {
    if (comparePasswordError)
      cb(error);
    else
      cb(null, pass1 === pass2);
  };

  context.db = {
    fetchUserByEmail(email) {
      return new Promise((resolve, reject) => {
        if (email === 'error-email')
          return reject(error);
        else if (email === 'non-existing-email')
          return resolve(null);
        else if (email === 'no-password-set')
          return resolve({ id: 'user1 '});
        else if (email === 'valid-user')
          resolve({
            id: 'user1',
            services: { password: { password: 'password' } }
          });
        else throw new Error("unknown test email: " + email);
      });
    }
  }

  it('self-test: throws on unknown test-email', () => {
    context.db.fetchUserByEmail('invalid').should.reject;
  });

  it('should catch db errors and pass to callback', (done) => {

    verify("error-email", "bar", (err, user, info) => {
      err.should.equal(error);
      should.equal(user, undefined);
      should.not.exist(info);
      done();
    });

  });

  it('should fail on no matching email', (done) => {

    verify("non-existing-email", "test123", (err, user, info) => {
      should.not.exist(err);
      user.should.be.false;
      info.should.equal("Invalid email");
      done();
    });

  });

  it('should fail on no matching password', (done) => {

    verify("valid-user", "non-matching-password", (err, user, info) => {
      should.not.exist(err);
      user.should.be.false;
      info.should.equal("Invalid password");
      done();
    });

  });

  it('should fail when user has no password set', (done) => {

    verify("no-password-set", "password", (err, user, info) => {
      should.not.exist(err);
      user.should.be.false;
      info.should.equal("No password set");
      done();
    });

  });

  it('should return a matching user when correct password given', (done) => {

    verify("valid-user", "password", (err, user, info) => {
      should.not.exist(err);
      user.id.should.equal("user1");
      should.not.exist(info);
      done();
    });

  });

  it('should call cb(err) on a thrown error', (done) => {

    comparePasswordError = true;
    verify("valid-user", "test123", (err, user) => {
      err.should.equal(error);
      should.equal(user, undefined);
      comparePasswordError = false; // reset for next test
      done();
    });

  });

});
