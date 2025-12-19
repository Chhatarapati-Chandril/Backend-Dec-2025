import dotenv from "dotenv"
import connectDB from "./db/db.js";

dotenv.config({
    path: ".env"
})


connectDB()











// (async (value) => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

//         app.on("Error", (error) => {
//             console.log("Error: ", error);
//             throw error
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`App is listenign on port: http://${process.env.PORT}`);
            
//         })

//     } catch (error) {
//         console.error("Error:", error);
//         throw error
//     }
// })()