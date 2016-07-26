export default function verify(email, password, done) {
  this.db.fetchUserByEmail(email)
    .then(user => {
      if (!user)
        return done(null, false, "Invalid email");

      this.comparePassword(password, user.password, (err, match) => {
        if (err)
          done(err);
        else if (match)
          done(null, user);
        else
          done(null, false, "Invalid password");
      });
    }).catch(err => done(err));
}
