export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://root:123456@localhost:27017/mydb?authSource=admin',
  port: process.env.PORT ?? 5050
}
