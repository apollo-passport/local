# Change Log
All notable changes to this project will be documented in this file.
This project will adhere to [Semantic Versioning](http://semver.org/) from v1.0.0+.
We use the format from [keepachangelog.com](keepachangelog.com).

## [Unreleased]

## [v0.0.3]
### Changed
* Service format is now `password.bcrypt`, i.e.
  `{ password: { bcrypt: "$a2...." } }` rather than `password.password`.
  This is both clearer, more forward compatible, and compatible with Meteor.

## [v0.0.2]
### Changed
* Use new `AugmentedStrategy` class format.  This is an internal change but now
  you no longer need to install `passport-local` yourself, it's an included dep.

[Unreleased]: https://github.com/apollo-passport/rethinkdbdash/compare/master...devel
[v0.0.3]: https://github.com/apollo-passport/apollo-passport/compare/v0.0.2...v0.0.3
[v0.0.2]: https://github.com/apollo-passport/apollo-passport/compare/v0.0.1...v0.0.2
