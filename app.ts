import express from "express";
import path from "path";
import router from "./router";
import { routerAdmin } from "./router-admin";
import morgan from "morgan";
import { MORGAN_FORMAT } from "./src/libs/types/types/config";

import session from "express-session";
import MongoDBStore from "connect-mongodb-session";
import { T } from "./src/libs/types/common";

const MongoDBStoreSession = MongoDBStore(session);

const store = new MongoDBStoreSession({
    uri: String(process.env.MONGO_URL),
    collection: "sessions",
});

//** 1-ENTRANCE */
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(morgan(MORGAN_FORMAT));

/** 2-SESSIONS  - Middleware sifatida integrratsiya qilindi*/

app.use(
    session({
        secret: String(process.env.SESION_SECRET),
        cookie: {
            maxAge: 1000 * 3600 * 3,   // 3 soat
        },
        store: store,
        resave: true, //auth refresh qiladi har safar, 
        //agar true bo'lsa, har safar sessiya ma'lumotlarini saqlaydi, 
        // false bo'lsa, faqat o'zgargan bo'lsa saqlaydi
        saveUninitialized: true
    }));


app.use((req, res, next) => {
    const sessionInstance = req.session as T;
    res.locals.member = sessionInstance.member;
    next();
});

/** 3-VIEWS */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/** 4-ROUTERS */
app.use("/admin", routerAdmin);  // SSR 
app.use("/", routerAdmin);       // SPA

export default app;