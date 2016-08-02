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

    async apUpdateUserPassword(root, { userId, oldPassword, newPassword }, context) {
      if (!(context && context.auth && context.auth.userId === userId))
        return "Not logged in as " + userId;

      const user = await this.db.fetchUserByEmail(userId);
      const storedPassword = user && user.services && user.services.password
        && user.services.password.password;

      // TODO allow no password only if email set.  allow email as part of query?

      if (storedPassword) {
        const match = await this.comparePassword(oldPassword, storedPassword);
        if (!match)
          return "Invalid old password";
      }

      try {
        await this.db.assertUserServiceData(userId,
          'password', { password: newPassword });
      } catch (err) {
        return err.message;
      }
      return "";
    }

  }

};

export default resolvers;
