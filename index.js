
import express from "express"
import router from "./routes/routes.js"
import passport from 'passport';
import connectMongoDB from './database/mongodb.js';
import session from 'express-session';
import cors from 'cors';


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"))
app.use("/", router)


connectMongoDB()


app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


const port = 8181;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
