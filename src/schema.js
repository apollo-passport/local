// PassportResult defined in apollo-passport

const typeDefinitions = `
type RootMutation {
  apCreateUserEmailPassword (email: String!, password: String!): PassportResult,
  apSetUserPassword (userId: String!, password: String!): String,
  apLoginEmailPassword (email: String!, password: String!): PassportResult
}
`;

export default [typeDefinitions];
