import mongoose from 'mongoose'

const mongoClient = async () => {
  try {
    console.log('connecting mongodb ....')

    // const mongoUrl = "mongodb://localhost:27017/a_task_list";
    const mongoUrl = process.env.MONGO_CLIENT
    if (!mongoUrl) {
      return console.log(
        'Please add mongoDB connection in env variable MONGO_CLIENT'
      )
    }

    const con = await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    if (con) {
      console.log('mongodb is connected')
    }
  } catch (error) {
    console.log(error)
  }
}

export default mongoClient
