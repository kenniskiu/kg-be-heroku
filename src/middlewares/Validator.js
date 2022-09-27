const { body, validationResult } = require("express-validator");

exports.validate = (method) => {
	switch (method) {
		case "createUser": {
			return [
				body("email", "Email address is invalid")
					.notEmpty()
					.trim()
					.normalizeEmail()
					.isEmail(),
				body("password", "Password should be at least 5 characters")
					.notEmpty()
					.isLength({ min: 5 }),
				body("full_name", "Full Name is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("gender", "Gender is invalid")
					.notEmpty()
					.trim()
					.isIn([0, 1, 2, 9]),
			];
		}

		case "loginUser": {
			return [
				body("email", "Email address is invalid")
					.notEmpty()
					.trim()
					.normalizeEmail()
					.isEmail(),
				body("password", "Password is required").notEmpty().trim(),
			];
		}

		case "forgetPasswordUser": {
			return [
				body("email", "Email address is invalid")
					.notEmpty()
					.trim()
					.normalizeEmail()
					.isEmail(),
			];
		}

		case "updateDataUser": {
			return [
				body("full_name", "Full Name is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("gender", "Gender is invalid")
					.notEmpty()
					.trim()
					.isIn([0, 1, 2, 9]),
			];
		}

		case "administrationBiodata": {
			return [
				body("administration_id", "Invalid administration id")
					.notEmpty()
					.trim(),
				body("full_name", "Invalid full name")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("email", "Invalid email").notEmpty().isEmail().trim(),
				body("nin", "Invalid nin").notEmpty().trim(),
				body("study_program", "Invalid study program / major").notEmpty(),
				body("semester", "Invalid semester").notEmpty().trim(),
				body("nin_address", "Invalid nin address").notEmpty(),
				body("residence_address", "Invalid residence address").notEmpty(),
				body("birth_place", "Invalid birth place").notEmpty(),
				body("birth_date", "Invalid birth date").notEmpty(),
				body("phone", "Invalid phone").notEmpty().trim(),
				body("gender", "Invalid gender").notEmpty().trim().isIn([0, 1, 2, 9]),
				body("nsn", "Invalid nsn").notEmpty().trim(),
				body("university_of_origin", "Invalid university of origin").notEmpty(),
			];
		}

		case "administrationFamilial": {
			return [
				body("administration_id", "Invalid administration id")
					.notEmpty()
					.trim(),

				body("father_name", "Invalid father name").notEmpty(),
				body("father_occupation", "Invalid father occupation").notEmpty(),
				body("father_income", "Invalid father income").notEmpty().trim(),

				body("mother_name", "Invalid mother name").notEmpty(),
				body("mother_occupation", "Invalid mother occupation").notEmpty(),
				body("mother_income", "Invalid mother income").notEmpty().trim(),

				body("occupation", "Invalid occupation").notEmpty(),
				body("income", "Invalid income").notEmpty().trim(),
				body("living_partner", "Invalid living partner").notEmpty(),
				body("financier", "Invalid financier").notEmpty(),
			];
		}

		case "administrationDegree": {
			return [
				body("administration_id", "Invalid administration id")
					.notEmpty()
					.trim(),
				body("degree", "Invalid degree").notEmpty(),
			];
		}

		case "createAdministration": {
			return [
				body("nin", "nin is Invalid").notEmpty().trim(),
				body("semester", "semester is Invalid").notEmpty().trim(),
				body("nsn", "nsn is Invalid").notEmpty().trim(),
				body("study_program", "study_program is Invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("residence_address", "residence_address is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("nin_address", "nin_address is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("phone", "phone is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("birth_place", "birth_place is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("birth_date", "birth_date is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("father_name", "father_name is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("father_occupation", "father_occupation is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("father_income", "father_income is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("mother_name", "mother_name is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("mother_occupation", "mother_occupation is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("mother_income", "mother_income is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("occupation", "occupation is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("income", "income is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("living_partner", "living_partner is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
				body("financier", "financier is invalid")
					.notEmpty()
					.trim()
					.isAlpha("en-US", { ignore: " " }),
			];
		}
	}
};

exports.validatorMessage = (req, res, next) => {
	let errors = validationResult(req).array({ onlyFirstError: true });
	if (!errors.length) return next();

	errors = errors.map((error) => error.msg);
	errors = `${errors.join(", ")}.`;

	return res.status(422).json({ success: false, message: errors, data: {} });
};
