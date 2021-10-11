import bcrypt from 'bcrypt'
const saltRounds = 10
export const hashPassword = (plainPass) => {
  return bcrypt.hashSync(plainPass, saltRounds)
}
export const verifyPassword = (plainPass, hashPassFromDB) => {
  console.log(bcrypt.compareSync(plainPass, hashPassFromDB))
  return bcrypt.compareSync(plainPass, hashPassFromDB)
}
