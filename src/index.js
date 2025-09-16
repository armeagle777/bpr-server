const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

dotenv.config();

const errorMiddleware = require("./middlewares/errorMiddleware");
const metricsMiddleware = require("./modules/metrics/metricsMiddleware");
const personsRoute = require("./modules/persons/routes");
const kadastrRoutes = require("./modules/kadastr/routes");
const wpRoutes = require("./modules/wp/routes");
const asylumRoutes = require("./modules/asylum/routes");
const companiesRoute = require("./modules/companies/routes");
const usersRouter = require("./modules/users/routes");
const tokenRouter = require("./modules/token/routes");
const likesRouter = require("./modules/like/routes");
const permissionsRouter = require("./modules/permission/routes");
const rolesRouter = require("./modules/role/routes");
const utilsRouter = require("./modules/utils/routes");
const logsRouter = require("./modules/log/routes");
const icRouter = require("./modules/IC/routes");
const mojCesRouter = require("./modules/MojCes/routes");
const taxRouter = require("./modules/Tax/routes");
const mlsaRouter = require("./modules/MLSA/routes");
const roadPoliceRouter = require("./modules/RoadPolice/routes");
const territorialMinistryRouter = require("./modules/TerritorialMinistry/routes");

const metricsRouter = require("./modules/metrics/routes");
const { sequelize } = require("./config/database");
const CronService = require("./integrations/CronService");

const app = express();
// const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || [];
app.use(
  cors({
    origin: [
      "http://localhost",
      "http://localhost:5173",
      "http://192.168.102.104",
    ],
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
app.use(metricsMiddleware);

app.use(morgan("common"));
app.use("/api/logs", logsRouter);
app.use("/api/users", usersRouter);
app.use("/api/token", tokenRouter);
app.use("/api/likes", likesRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/permissions", permissionsRouter);

app.use("/api/persons", personsRoute);
app.use("/api/petregistr", companiesRoute);
app.use("/api/kadastr", kadastrRoutes);
app.use("/api/wp", wpRoutes);
app.use("/api/asylum", asylumRoutes);
app.use("/api/ic", icRouter);
app.use("/api/moj-ces", mojCesRouter);
app.use("/api/mlsa", mlsaRouter);
app.use("/api/tax", taxRouter);
app.use("/api/road-police", roadPoliceRouter);
app.use("/api/territorial-ministry", territorialMinistryRouter);
app.use("/api/utils", utilsRouter);
app.use("/api/metrics", metricsRouter);

app.use(errorMiddleware);
const PORT = process.env.PORT || 9000;

const cronService = new CronService();
cronService.start();

app.listen(PORT, async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Connections connected and synced successfully.");
    console.log("App is running on port ", PORT);
  } catch (err) {
    console.log("err::::::", err);
  }
});
