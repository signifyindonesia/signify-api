const profileHandler = async (request, h) => {
  const user = request.auth.credentials;

  return h
    .response({
      status: "success",
      message: "Profil pengguna berhasil diambil.",
      data: {
        email: user.email,
        name: user.name,
      },
    })
    .code(200);
};

export default profileHandler;
