import "dotenv/config";
import Hapi from "@hapi/hapi";
import routes from "./routes/routes.js";

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 9000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"], // agar bisa akses dari Postman/frontend
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
