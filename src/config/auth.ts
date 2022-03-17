export default {
  jwt: {
    secret: `${process.env.SECRET_KEY}` as string,
    expiresIn: '1d'
  }
}
