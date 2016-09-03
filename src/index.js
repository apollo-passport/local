// Core node modules && npm packages
import bcrypt from 'bcrypt';

// Passport modules
import { Strategy as LocalStrategy } from 'passport-local';

// Local modules
import defaultOptions from './defaultOptions';
import verify from './verify';
import resolvers from './resolvers';
import schema from './schema';

const BCRYPT_SALT_ROUNDS=10;

const extensionMethods = {

  hashPassword(password, cb) {
    if (cb)
      return bcrypt.hash(password, BCRYPT_SALT_ROUNDS, cb);

    return new Promise((resolve, reject) => {
      bcrypt.hash(password, BCRYPT_SALT_ROUNDS,
        (err, res) => err ? reject(err) : resolve(res) );
    });
  },

  comparePassword(password, hash, cb) {
    if (cb)
      return bcrypt.compare(password, hash, cb);

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash,
        (err, res) => err ? reject(err) : resolve(res) );
    });
  }

};

class AugmentedLocalStrategy {

  constructor(apolloPassport, options) {
    this.ap = apolloPassport;

    if (!options)
      options = defaultOptions;

    this.strategy = new LocalStrategy(options, verify.bind(this.ap));

    this.resolvers = resolvers;
    this.schema = schema;

    this.ap.extendWith(extensionMethods);
  }

}

AugmentedLocalStrategy.__isAugmented = true;

export { AugmentedLocalStrategy as Strategy };
export default AugmentedLocalStrategy;
