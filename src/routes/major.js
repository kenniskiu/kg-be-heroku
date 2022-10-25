const express = require("express");
const route = express.Router();
const multer = require("multer");

const majorController = require("../controllers/majorController");
const {
	protection,
	authorize,
	existence,
} = require("../middlewares/Authentication");

const { Major } = require("../models");

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 2000000 },
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype == "image/png" ||
			file.mimetype == "image/jpg" ||
			file.mimetype == "image/jpeg"
		) {
			return cb(null, true);
		} else {
			cb(null, true);
			return cb(
				new Error(
					"Sorry, this upload only support file with type .png, .jpg or .jpeg.",
					400
				)
			);
		}
	},
});

route.get("/", protection, majorController.getAllMajors);
route.post(
	"/create",
	protection,
	upload.single("thumbnail"),
	majorController.postMajor
);

route.get("/:major_id", protection, majorController.getMajor);
route.post(
	"/insertsubjects/:major_id",
	protection,
	majorController.insertSubjectToMajor
);

route.put(
	"/edit/:major_id",
	protection,
	upload.single("thumbnail"),
	majorController.editMajor
);
route.delete("/delete/:major_id", protection, majorController.removeMajor);

route.post(
	"/take/:major_id",
	protection,
	authorize("student", "user"),
	existence(Major),
	majorController.enrollMajor
);

module.exports = route;
