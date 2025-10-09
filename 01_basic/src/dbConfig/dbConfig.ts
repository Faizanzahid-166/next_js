import mongoose from 'mongoose'

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URL!)
        const connection = mongoose.connection

        connection.on('connnected' ,() => {
            console.log('Mongodb connected');
        })

        connection.on('error' ,(err) => {
            console.log('Mongodb error' + err);
            process.exit()
        })

    } catch (error) {
        console.log('went wrong dbConnection');
        console.log(error)
    }
}