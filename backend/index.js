import dotenv from "dotenv";
import app from "./src/app.js";
import { connectToDB } from "./src/database.js";

dotenv.config()

const PORT = process.env.P0RT || 8000

connectToDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log("Server Started at ", PORT)
        })
    })
    .catch(err => {
        console.log("Error connecting the DB", err)
    })
