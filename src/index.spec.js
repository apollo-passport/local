import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import proxyquire from 'proxyquire';

chai.use(chaiAsPromised);

let throwErr = false;
const bcrypt = {
  hash(password, rounds, cb) {
    if (throwErr) {
      cb(throwErr);
      throwErr = false;
    } else
      cb(null, 'hashed:' + password);
  },
  compare(password, hash, cb) {
    if (throwErr) {
      cb(throwErr);
      throwErr = false;
    } else
      cb(null, hash === 'hashed:' + password)
  }
};

const should = chai.should();
const LocalStrategy = proxyquire('./index', { bcrypt }).default;

const apolloPassport = {
  extendWith(obj) {
    for (var key in obj)
      apolloPassport[key] = obj[key];
  }
};

describe('apollo-passport-loca', () => {

  const ap = apolloPassport;
  let local;
  before(() => {
    local = new LocalStrategy(ap);
  });

  describe('hashPassword', () => {

    it('works with a callback', (done) => {
      ap.hashPassword('password', (err, hashed) => {
        hashed.should.equal('hashed:password');
        done();
      });
    });

    it('returns a promise if no callback given', async () => {
      const hashed = await ap.hashPassword('password');
      hashed.should.equal('hashed:password');
    });

    it('the promise rejects on error', () => {
      throwErr = new Error('test');
      ap.hashPassword('a').should.be.rejected;
    });

  });

  describe('comparePassword', () => {

    it('works with a callback', (done) => {
      ap.comparePassword('password', 'hashed:password', (err, match) => {
        match.should.be.true;
      });

      ap.comparePassword('password', 'no-match', (err, match) => {
        match.should.be.false;
        done();
      });
    });

    it('returns a promise if no callback given', async () => {
      let match;

      match = await ap.comparePassword('password', 'hashed:password');
      match.should.be.true;

      match = await ap.comparePassword('password', 'no-match');
      match.should.be.false;

      throwErr = new Error('test');
      ap.comparePassword('a', 'b').should.be.rejected;
    });

  });

});
