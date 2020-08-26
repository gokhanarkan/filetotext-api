const ErrorResponse = require("../utils/errorResponse");

exports.convertFile = async (req, res, next) => {
	const file = req.files.file;

	if (!file) {
    	return next(
      		new ErrorResponse("File is not here", 400)
    	);
	}

	console.log(file);

	// TODO
	// Validate size
	// Valida mimetype

	res.status(200).json({
		success: true,
		data: 'HelloWorld'
	});
}