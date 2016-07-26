import bcrypt from 'bcrypt';

const BCRYPT_SALT_ROUNDS=10;

const extensionMethods = {

  hashPassword(password, cb) {
    if (cb)
      return bcrypt.hash(password, BCRYPT_SALT_ROUNDS, cb);

    return new Promise((resolve, reject) => {
      bcrypt.hash(password, BCRYPT_SALT_ROUNDS,
        (err, res) => { err ? reject(err) : resolve(res) });
    });
  },

  comparePassword(password, hash, cb) {
    if (cb)
      return bcrypt.compare(password, hash, cb);

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash,
        (err, res) => { err ? reject(err) : resolve(res) });
    });
  }

};

class LocalStrategy {

  constructor(apolloPassport) {
    this.ap = apolloPassport;
    apolloPassport.extendWith(extensionMethods);
  }

}

export default LocalStrategy;
