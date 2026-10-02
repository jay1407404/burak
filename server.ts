import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import app from "./app";

mongoose
    .connect(process.env.MONGO_URL as string, {})
    .then(data => {
        const port = process.env.PORT ?? 3003;
        console.log('MongoDB connection succeed');
        app.listen(port, () => {
            console.info(`The server is running successfully on port: ${port}`);
            console.info(`Admin project on http://localhost:${port}/admin \n`);
        });
    })
    .catch(err => console.log("ERROR on connection MongoDB", err));