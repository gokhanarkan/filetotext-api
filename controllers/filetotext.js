const ErrorResponse = require("../utils/errorResponse");
const AWS = require("aws-sdk");
const { createWorker } = require("tesseract.js");

exports.convertFile = async (req, res, next) => {
  const file = req.files.file;

  if (!file) {
    return next(new ErrorResponse("File is not here", 400));
  }

  const isFileAccepted = checkFileType(file);

  if (!isFileAccepted) {
    return next(new ErrorResponse("File type is not accepted.", 400));
  }

  const worker = createWorker();

  await worker.load();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  const {
    data: { text },
  } = await worker.recognize(file.data);
  await worker.terminate();

  res.status(200).json({
    success: true,
    data: text,
  });

  // TODO
  // Validate size
  // Valida mimetype
};

exports.convertFileWithAWS = async (req, res, next) => {
  const file = req.files.file;

  if (!file) {
    return next(new ErrorResponse("File is not here", 400));
  }

  const isFileAccepted = checkFileType(file);

  if (!isFileAccepted) {
    return next(new ErrorResponse("File type is not accepted.", 400));
  }

  try {
    const textract = new AWS.Textract({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
      region: "eu-west-2",
    });

    const params = {
      Document: {
        Bytes: file.data,
      },
    };

    textract.detectDocumentText(params, function (err, data) {
      if (err) {
        return next(new ErrorResponse("Error with AWS", 500));
      }

      const text = data.Blocks.reduce((total, value) => {
        if (value.BlockType === "LINE") {
          total += value.Text + "\n";
        }
        return total;
      }, "");

      res.status(200).json({
        success: true,
        data: text,
      });
    });
  } catch (err) {
    return next(new ErrorResponse("Error with AWS", 500));
  }
};

checkFileType = (file) => {
  // Currently accepting only jpeg and png
  const acceptedTypes = ["image/jpeg", "image/png"];
  return acceptedTypes.includes(file.mimetype) ? true : false;
};
