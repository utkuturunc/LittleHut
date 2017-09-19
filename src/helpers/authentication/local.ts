import { Strategy as LocalStrategy } from 'passport-local'
export const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, done) => {
    console.log({ email, password })
    return done(null, { id: 4 })
  }
)
