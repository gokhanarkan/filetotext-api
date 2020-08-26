const ErrorResponse = require("../utils/errorResponse");
const AWS = require("aws-sdk");

exports.convertFile = async (req, res, next) => {
  const file = req.files.file;

  if (!file) {
    return next(new ErrorResponse("File is not here", 400));
  }

  // TODO
  // Validate size
  // Valida mimetype

  try {
    const textract = new AWS.Textract({
      accessKeyId: "AKIAJQJO5M724V6HG2ZA",
      secretAccessKey: "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",
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
      let responseData = ""
      data.Blocks.forEach(item => {
        if (item.BlockType === 'WORD') {
          responseData += item.Text + " "
        }
      })
      res.status(200).json({
        success: true,
        data: responseData
      })
    });
  } catch (err) {
    return next(new ErrorResponse("Error with AWS", 500));
  }
};
