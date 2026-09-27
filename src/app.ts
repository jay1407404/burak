import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./routerAdmin"
import morgan from "morgan";

//** 1-ENTRANCE */
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan(`:method :url :response-time [:status] /n`))


/** 2-SESSIONS */


/** 3-VIEWS */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/** 4-ROUTERS */
app.use("/admin", routerAdmin);  // EJS 
app.use("/", routerAdmin);       // REACT

export default app;