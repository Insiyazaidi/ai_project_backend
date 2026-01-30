import mongoose from "mongoose"
const connectdb = async()=>{
      try{
        const conn = await mongoose.connect(process.env.MONGO_URL );
       console.log(`mongoose connected ${conn.connection.host}`)
      }
            catch(error){
                console.log(`error conection db ${error.message}`)
                process.exit(1);
            }
}
export default connectdb