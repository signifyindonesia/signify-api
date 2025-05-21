import "dotenv/config";
import Hapi from "@hapi/hapi";
import routes from "./routes/routes.js";

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 9000,
    host: "0.0.0.0", // Ganti "localhost" jika ingin menjalankan API di lokal
    routes: {
      cors: {
        origin: ["*"], // agar bisa akses dari Postman/frontend
      },
    },
  });

  server.route(routes);
  server.ext("onPreResponse", (request, h) => {
    const response = request.response;

    // Tangani hanya error
    if (response.isBoom) {
      const statusCode = response.output.statusCode;

      let message = "Terjadi kesalahan pada server.";
      if (statusCode === 401)
        message = "Token tidak valid atau sudah kadaluarsa.";
      if (statusCode === 403) message = "Akses ditolak.";
      if (statusCode === 404) message = "Endpoint tidak ditemukan.";

      return h
        .response({
          error: "fail",
          message,
        })
        .code(statusCode);
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
