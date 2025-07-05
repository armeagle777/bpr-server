const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
var CronJob = require("cron").CronJob;
const morgan = require("morgan");

dotenv.config();

const errorMiddleware = require("./middlewares/errorMiddleware");
const personsRoute = require("./modules/persons/routes");
const kadastrRoutes = require("./modules/kadastr/routes");
const artsakhRoutes = require("./modules/artsakh/routes");
const wpRoutes = require("./modules/wp/routes");
const companiesRoute = require("./modules/companies/routes");
const sphereRoute = require("./modules/sphere/routes");
const statisticsRoute = require("./modules/statistics/routes");
const usersRouter = require("./modules/users/routes");
const tokenRouter = require("./modules/token/routes");
const likesRouter = require("./modules/like/routes");
const texekanqRouter = require("./modules/texekanq/routes");
const sharesRouter = require("./modules/share/routes");
const permissionsRouter = require("./modules/permission/routes");
const rolesRouter = require("./modules/role/routes");
const utilsRouter = require("./modules/utils/routes");
const { sphereSequelize } = require("./config/sphereDatabase");

const { cronUpdateSphere, cronUpdateSphereText } = require("./utils/common");
const { sphereCronConfig } = require("./utils/constants");
const { sahmanahatumSequelize } = require("./config/sahmanahatumDb");
const { wpSequelize } = require("./config/wpDatabase");

var job = new CronJob(
  sphereCronConfig,
  cronUpdateSphere,
  null,
  true,
  "Asia/Yerevan"
);

const updateSphereTextJob = new CronJob(
  "15 20 * * *",
  cronUpdateSphereText,
  null,
  true,
  "Asia/Yerevan"
);

const app = express();
app.use(
  cors({
    origin: [
      "http://192.168.3.253:5173",
      "http://localhost:5173",
      "http://localhost",
      "http://192.168.3.179:5173",
      "http://102.102.100.5",
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

app.use(morgan("common"));
app.use("/api/users", usersRouter);
app.use("/api/token", tokenRouter);
app.use("/api/likes", likesRouter);
app.use("/api/texekanq", texekanqRouter);
app.use("/api/shares", sharesRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/permissions", permissionsRouter);

app.use("/api/persons", personsRoute);
app.use("/api/petregistr", companiesRoute);
app.use("/api/kadastr", kadastrRoutes);
app.use("/api/artsakh", artsakhRoutes);
app.use("/api/wp", wpRoutes);
app.use("/api/sphere", sphereRoute);
app.use("/api/utils", utilsRouter);

//Statistics Endpoints
app.use("/api/statistics", statisticsRoute);

app.use(errorMiddleware);
const PORT = process.env.PORT || 9000;

app.listen(PORT, async () => {
  try {
    await sphereSequelize.sync({ alter: true });
    await sahmanahatumSequelize.sync({ alter: true });
    await wpSequelize.sync({ alter: true });
    console.log("Connections connected and synced successfully.");
    console.log("App is running on port ", PORT);
  } catch (err) {
    console.log("err::::::", err);
  }
});
