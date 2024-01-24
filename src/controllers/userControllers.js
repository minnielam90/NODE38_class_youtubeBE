const uploadSingleAvatar = (req, res) => {
  // if (!req.file) {
  //   res.send({
  //     statusCode: 400,
  //     message: "No file Upload",
  //   });
  //   return;
  // }
  // res.json({ secure_url: req.file.path });
  res.send(req.file);
};

const uploadMultipleAvatar = (req, res) => {
  res.send(req.files);
};

export { uploadSingleAvatar, uploadMultipleAvatar };
