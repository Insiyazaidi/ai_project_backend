import mongoose from "mongoose"
const connectdb = async()=>{
      try{
        const conn = await mongoose.connect( "mongodb+srv://zaidiinsiya83_db_user:ndKjogCzjEvbqTwo@cluster0.tauoj0n.mongodb.net/");
       console.log(`mongoose connected ${conn.connection.host}`)
      }
            catch(error){
                console.log(`error conection db ${error.message}`)
                process.exit(1);
            }
}
export default connectdb