const notFoundHandler = (request, h) => {
  return h
    .response({
      error: "fail",
      message: "endpoint tidak ditemukan",
    })
    .code(404);
};

export default notFoundHandler;
