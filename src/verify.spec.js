import chai from 'chai';
import 'regenerator-runtime/runtime';

import _verify from './verify';

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
        if (email === 'error@test.com')
          return reject(error);
        else if (email !== 'test@test.com')
          return resolve(null);
        else
          resolve({ id: 'user1', password: 'password' });
      });
    }
  }

  it('should catch db errors and pass to callback', (done) => {

    verify("error@test.com", "bar", (err, user, info) => {
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

    verify("test@test.com", "non-matching-password", (err, user, info) => {
      should.not.exist(err);
      user.should.be.false;
      info.should.equal("Invalid password");
      done();
    });

  });

  it('should return a matching user when correct password given', (done) => {

    verify("test@test.com", "password", (err, user, info) => {
      should.not.exist(err);
      user.id.should.equal("user1");
      should.not.exist(info);
      done();
    });

  });

  it('should call cb(err) on a thrown error', (done) => {

    comparePasswordError = true;
    verify("test@test.com", "test123", (err, user) => {
      err.should.equal(error);
      should.equal(user, undefined);
      comparePasswordError = false; // reset for next test
      done();
    });

  });

});
