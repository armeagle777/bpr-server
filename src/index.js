const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

dotenv.config();

const errorMiddleware = require("./middlewares/errorMiddleware");
const personsRoute = require("./modules/persons/routes");
const kadastrRoutes = require("./modules/kadastr/routes");
const artsakhRoutes = require("./modules/artsakh/routes");
const wpRoutes = require("./modules/wp/routes");
const companiesRoute = require("./modules/companies/routes");
const usersRouter = require("./modules/users/routes");
const tokenRouter = require("./modules/token/routes");
const likesRouter = require("./modules/like/routes");
const permissionsRouter = require("./modules/permission/routes");
const rolesRouter = require("./modules/role/routes");
const utilsRouter = require("./modules/utils/routes");
const { sphereSequelize } = require("./config/sphereDatabase");

const app = express();
// const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || [];
app.use(
  cors({
    origin: ["http://localhost", "http://192.168.102.104"],
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(morgan("common"));
app.use("/api/users", usersRouter);
app.use("/api/token", tokenRouter);
app.use("/api/likes", likesRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/permissions", permissionsRouter);

app.use("/api/persons", personsRoute);
app.use("/api/petregistr", companiesRoute);
app.use("/api/kadastr", kadastrRoutes);
app.use("/api/artsakh", artsakhRoutes);
app.use("/api/wp", wpRoutes);
app.use("/api/utils", utilsRouter);

app.use(errorMiddleware);
const PORT = process.env.PORT || 9000;

app.listen(PORT, async () => {
  try {
    await sphereSequelize.sync({ alter: true });
    console.log("Connections connected and synced successfully.");
    console.log("App is running on port ", PORT);
  } catch (err) {
    console.log("err::::::", err);
  }
});
