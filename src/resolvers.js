import bcrypt from 'bcrypt';

const resolvers = {

  RootMutation: {
    async apCreateUserEmailPassword(root, { email, password }) {
      // First check if we already have a user with that email
      const existing = await this.db.fetchUserByEmail(email);
      if (existing)
        return { token: "", error: "E-mail already registered" };

      const user = {
        emails: [ { address: email } ],
        services: { password: { password: await this.hashPassword(password) } }
      };

      let userId;
      try {
        userId = await this.createUser(user);
      } catch (err) {
        return {
          error: err.message,
          token: ""
        };
      }

      // XXX correct id field?
      user.id = userId;

      return {
        error: "",
        token: this.createTokenFromUser(user)
      };
    },

    apLoginEmailPassword(root, args) {
      return new Promise((resolve, reject) => {

        this.passport.authenticate('local', (err, user, info) => {

          if (err)
            return reject(err);

          if (!user || info)
            return resolve({ error: info, token: "" });

          resolve({
            error: "",
            token: this.createTokenFromUser(user)
          });

        })({ query: args }); // fake req.query using args from graphQL

      });
    },

    // TODO require existing password
    async apSetUserPassword(root, { userId, password }, context) {
      if (!(context && context.auth && context.auth.userId === userId))
        return "Not logged in as " + userId;

      try {
        await this.db.assertUserServiceData(userId, 'password', { password });
      } catch (err) {
        return err.message;
      }
      return "";
    }

  }

};

export default resolvers;