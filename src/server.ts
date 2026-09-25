import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import app from "./app";

mongoose
    .connect(process.env.MONGO_URL as string, {})
    .then(data => {
        console.log('MongoDB connection succeed');
        app.listen((process.env.PORT ?? 3003), () => {
            console.log(`The server is running successfully on port: ${process.env.PORT ?? 3003}`);
        });
    })
    .catch(err => console.log("ERROR on connection MongoDB", err));