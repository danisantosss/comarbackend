import express from "express";
import routerSistema from "./router/routerProjeto.js";
import cors from "cors";
import routerUsuario from "./router/routerUsuario.js";

const allowedOrigins = [
  "https://projetocomar.onrender.com",
  "https://stirring-daifuku-117c86.netlify.app"
];

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  optionsSuccessStatus: 200
};

const app = express();
const port = 10254;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use("/projeto", routerSistema);
app.use("/usuario", routerUsuario);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
