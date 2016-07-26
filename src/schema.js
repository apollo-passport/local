// PassportResult defined in apollo-passport

const typeDefinitions = `
type RootMutation {
  passportLoginEmail (email: String!, password: String!): PassportResult
}
`;

export default [typeDefinitions];
