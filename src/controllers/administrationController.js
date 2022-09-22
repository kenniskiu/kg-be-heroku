const asyncHandler = require("express-async-handler");
const { Administration, User } = require("../models");
const ErrorResponse = require("../utils/errorResponse");
const {
	getStorage,
	ref,
	getDownloadURL,
	deleteObject,
} = require("firebase/storage");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");

module.exports = {
	/**
	 * @desc      Initiate admin data
	 * @route     GET /api/v1/administrations/getcurrentuseradmindata
	 * @access    Private (User)
	 */
	getCurrentUserAdminData: asyncHandler(async (req, res, next) => {
		const user = req.userData;

		let data = await Administration.findOne({
			where: {
				student_id: user.id,
			},
			include: user,
		});

		if (!data) {
			data = await Administration.create(
				{
					student_id: user.id,
					created_by: user.id,
					is_approved: "waiting",
					approved_by: null,
				},
				{
					include: user,
				}
			);
			return res.sendJson(
				200,
				true,
				"Successfully created administration of user",
				data
			);
		}

		const ret_data = {
			administration_id: data.id,
			biodata: {
				nin: nin,
				study_program: study_program,
				semester: semester,
				nin_address: nin_address,
				residence_address: residence_address,
				birth_place: birth_place,
				birth_date: birth_date,
				phone: phone,
				gender: gender,
				nsn: nsn,
			},
			familial: {
				father_name: father_name,
				father_occupation: father_occupation,
				father_income: father_income,
				mother_name: mother_name,
				mother_occupation: mother_occupation,
				mother_income: mother_income,

				occupation: occupation,
				income: income,
				living_partner: living_partner,
				financier: financier,
			},
			files: {
				integrity_pact: integrity_pact,
				nin_card: nin_card,
				family_card: family_card,
				certificate: certificate,
				photo: photo,
				transcript: transcript,
				recommendation_letter: recommendation_letter,
			},
			degree: {
				degree: degree,
				is_approved: is_approved,
				approved_by: approved_by,
			},
		};

		return res.sendJson(
			200,
			true,
			"Successfully retrieved administration of user",
			ret_data
		);
	}),
	/**
	 * @desc      Insert Administration for self data
	 * @route     POST /api/v1/administrations/biodata
	 * @access    Private (User)
	 */
	selfDataAdministration: asyncHandler(async (req, res, next) => {
		const user = req.userData;
		const {
			administrationId,

			nin,
			study_program,
			semester,
			nin_address,
			residence_address,
			birth_place,
			birth_date,
			phone,
			gender,
			nsn,
		} = req.body;

		if (
			!nin ||
			!study_program ||
			!semester ||
			!nin_address ||
			!residence_address ||
			!birth_place ||
			!birth_date ||
			!phone ||
			!gender ||
			!nsn
		) {
			return res.sendJson(400, false, "Some fields are missing.", {});
		}

		let data = await Administration.findOne({
			where: {
				id: administrationId,
			},
		});

		if (!data) {
			return res.sendJson(400, false, "invalid administration Id.", {});
		}

		data = await Administration.update(
			{
				// non - file
				nin,
				study_program,
				semester,
				nin_address,
				residence_address,
				birth_place,
				birth_date,
				phone,
				gender,
				nsn,

				updated_by: user.id,
				is_approved: "waiting",
				approved_by: null,
			},
			{
				where: {
					id: administrationId,
				},
				include: User,
				returning: true,
				plain: true,
			}
		);

		return res.sendJson(
			200,
			true,
			"Successfully created administration with self data",
			data
		);
	}),
	/**
	 * @desc      Insert Administration for familial data
	 * @route     POST /api/v1/administrations/familial
	 * @access    Private (User)
	 */
	familialAdministration: asyncHandler(async (req, res, next) => {
		const user = req.userData;

		const {
			administrationId,

			father_name,
			father_occupation,
			father_income,
			mother_name,
			mother_occupation,
			mother_income,

			occupation,
			income,
			living_partner,
			financier,
		} = req.body;

		if (
			!father_name ||
			!father_occupation ||
			!father_income ||
			!mother_name ||
			!mother_occupation ||
			!mother_income ||
			!occupation ||
			!income ||
			!living_partner ||
			!financier
		) {
			return res.sendJson(400, false, "Some fields are missing.", {});
		}

		let data = await Administration.findOne({
			where: {
				id: administrationId,
			},
		});

		if (!data) {
			return res.sendJson(400, false, "invalid administration id", {});
		}

		data = await Administration.update(
			{
				father_name,
				father_occupation,
				father_income,
				mother_name,
				mother_occupation,
				mother_income,

				occupation,
				income,
				living_partner,
				financier,

				updated_by: user.id,
			},
			{
				where: {
					id: administrationId,
					returning: true,
					plain: true,
				},
			}
		);

		return res.status(200).json({
			success: true,
			message: `edited admin with ID ${administrationId} with familial data successfully.`,
			data,
		});
	}),

	/**
	 * @desc      Insert Administration files
	 * @route     POST /api/v1/administrations/files
	 * @access    Private (User)
	 */
	filesAdministration: asyncHandler(async (req, res, next) => {
		const user = req.userData;

		const { administrationId } = req.body;

		if (!administrationId) {
			return res.sendJson(400, false, "no administration ID", {});
		}

		let data = await Administration.findOne({
			where: {
				id: administrationId,
			},
		});
		if (!data) {
			return res.sendJson(400, false, "invalid administration ID", {});
		}

		const integrityPactFile =
			uuidv4() +
			"-" +
			req.files.integrity_pact[0].originalname.split(" ").join("-");
		const integrityFactBuffer = req.files.integrity_pact[0].buffer;

		const ninCardFile =
			uuidv4() + "-" + req.files.nin_card[0].originalname.split(" ").join("-");
		const ninCardBuffer = req.files.nin_card[0].buffer;

		const familyCardFile =
			uuidv4() +
			"-" +
			req.files.family_card[0].originalname.split(" ").join("-");
		const familyCardBuffer = req.files.family_card[0].buffer;

		const certificateFile =
			uuidv4() +
			"-" +
			req.files.certificate[0].originalname.split(" ").join("-");
		const certificateBuffer = req.files.certificate[0].buffer;

		const photoFile =
			uuidv4() + "-" + req.files.photo[0].originalname.split(" ").join("-");
		const photoBuffer = req.files.photo[0].buffer;

		const transcriptFile =
			uuidv4() +
			"-" +
			req.files.transcript[0].originalname.split(" ").join("-");
		const transcriptBuffer = req.files.transcript[0].buffer;

		const recommendationLetterFile =
			uuidv4() +
			"-" +
			req.files.recommendation_letter[0].originalname.split(" ").join("-");
		const recommendationLetterBuffer =
			req.files.recommendation_letter[0].buffer;

		const bucket = admin.storage().bucket();
		const storage = getStorage();

		bucket
			.file(`documents/${integrityFactFile}`)
			.createWriteStream()
			.end(integrityFactBuffer);
		bucket
			.file(`documents/${ninCardFile}`)
			.createWriteStream()
			.end(ninCardBuffer);
		bucket
			.file(`documents/${familyCardFile}`)
			.createWriteStream()
			.end(familyCardBuffer);
		bucket
			.file(`documents/${certificateFile}`)
			.createWriteStream()
			.end(certificateBuffer);
		bucket.file(`documents/${photoFile}`).createWriteStream().end(photoBuffer);
		bucket
			.file(`documents/${transcriptFile}`)
			.createWriteStream()
			.end(transcriptBuffer);
		bucket
			.file(`documents/${recommendationLetterFile}`)
			.createWriteStream()
			.end(recommendationLetterBuffer);

		data = await Administration.update(
			{
				updated_by: user.id,

				// file
				integrity_pact: `documents/${integrityFactFile}`,
				nin_card: `documents/${ninCardFile}`,
				family_card: `documents/${familyCardFile}`,
				certificate: `documents/${certificateFile}`,
				photo: `documents/${photoFile}`,
				transcript: `documents/${transcriptFile}`,
				recommendation_letter: `documents/${recommendationLetterFile}`,

				is_approved: "waiting",
				approved_by: null,
			},
			{
				where: { id: administrationId },
				returning: true,
				plain: true,
				include: User,
			}
		);

		data = await Administration.findOne({
			where: { id: data.id },
			include: [
				{
					model: User,
				},
			],
			attributes: {
				exclude: ["user_id"],
			},
		});

		return res.sendJson(201, true, "Successfully uploaded files", {
			...data,
		});
	}),

	/**
	 * @desc      pick degree
	 * @route     POST /api/v1/administrations/degree
	 * @access    Private (User)
	 */
	degreeAdministration: asyncHandler(async (req, res, next) => {
		const user = req.userData;
		const { administrationId, degree } = req.body;

		if (!administrationId || !degree) {
			return res.sendJson(400, false, "Some fields are missing.", {});
		}

		const data = await Administration.update(
			{
				// non - file
				degree,

				is_approved: "waiting",
				approved_by: null,
			},
			{
				include: User,
				where: {
					id: administrationId,
				},
			}
		);

		return res.sendJson(
			200,
			true,
			"Successfully submitted administration for review",
			data
		);
	}),

	/**
	 * @desc      Insert Administration (Input Administrasi)
	 * @route     POST /api/v1/administrations/create-administration
	 * @access    Private (User)
	 */
	createAdministration: asyncHandler(async (req, res, next) => {
		const user = req.userData;

		const {
			nin,
			study_program,
			semester,
			nin_address,
			residence_address,
			birth_place,
			birth_date,
			phone,
			gender,
			nsn,

			domicile,
			financier,
			father_name,
			mother_name,
			father_occupation,
			mother_occupation,
			job,
			income,
			father_income,
			mother_income,
		} = req.body;

		if (
			!nin ||
			!study_program ||
			!semester ||
			!residence_address ||
			!nin_address ||
			!phone ||
			!birth_place ||
			!domicile ||
			!financier ||
			!father_name ||
			!mother_name ||
			!father_occupation ||
			!mother_occupation ||
			!job ||
			!income ||
			!father_income ||
			!mother_income
		) {
			return res.sendJson(400, false, "Some fields is missing.", {});
		}

		const integrityFactFile =
			uuidv4() +
			"-" +
			req.files.integrity_pact[0].originalname.split(" ").join("-");
		const integrityFactBuffer = req.files.integrity_pact[0].buffer;

		const ninCardFile =
			uuidv4() + "-" + req.files.nin_card[0].originalname.split(" ").join("-");
		const ninCardBuffer = req.files.nin_card[0].buffer;

		const familyCardFile =
			uuidv4() +
			"-" +
			req.files.family_card[0].originalname.split(" ").join("-");
		const familyCardBuffer = req.files.family_card[0].buffer;

		const certificateFile =
			uuidv4() +
			"-" +
			req.files.certificate[0].originalname.split(" ").join("-");
		const certificateBuffer = req.files.certificate[0].buffer;

		const photoFile =
			uuidv4() + "-" + req.files.photo[0].originalname.split(" ").join("-");
		const photoBuffer = req.files.photo[0].buffer;

		const transcriptFile =
			uuidv4() +
			"-" +
			req.files.transcript[0].originalname.split(" ").join("-");
		const transcriptBuffer = req.files.transcript[0].buffer;

		const recommendationLetterFile =
			uuidv4() +
			"-" +
			req.files.recommendation_letter[0].originalname.split(" ").join("-");
		const recommendationLetterBuffer =
			req.files.recommendation_letter[0].buffer;

		const bucket = admin.storage().bucket();

		bucket
			.file(`documents/${integrityFactFile}`)
			.createWriteStream()
			.end(integrityFactBuffer);
		bucket
			.file(`documents/${ninCardFile}`)
			.createWriteStream()
			.end(ninCardBuffer);
		bucket
			.file(`documents/${familyCardFile}`)
			.createWriteStream()
			.end(familyCardBuffer);
		bucket
			.file(`documents/${certificateFile}`)
			.createWriteStream()
			.end(certificateBuffer);
		bucket.file(`documents/${photoFile}`).createWriteStream().end(photoBuffer);
		bucket
			.file(`documents/${transcriptFile}`)
			.createWriteStream()
			.end(transcriptBuffer);
		bucket
			.file(`documents/${recommendationLetterFile}`)
			.createWriteStream()
			.end(recommendationLetterBuffer);

		const data = await Administration.create(
			{
				// non - file
				user_id: user.id,
				nin,
				study_program,
				semester,
				residence_address,
				nin_address,
				phone,
				birth_place,
				domicile,
				financier,
				father_name,
				mother_name,
				father_occupation,
				mother_occupation,
				job,
				income,
				father_income,
				mother_income,

				// file
				integrity_pact: `documents/${integrityFactFile}`,
				nin_card: `documents/${ninCardFile}`,
				family_card: `documents/${familyCardFile}`,
				certificate: `documents/${certificateFile}`,
				photo: `documents/${photoFile}`,
				transcript: `documents/${transcriptFile}`,
				recommendation_letter: `documents/${recommendationLetterFile}`,
				is_approved: "waiting",
				approved_by: null,
			},
			{
				include: User,
			}
		);

		const asdasd = await Administration.findOne({
			where: { id: data.dataValues.id },
			include: [
				{
					model: User,
				},
			],
			attributes: {
				exclude: ["user_id"],
			},
		});

		return res.sendJson(201, true, "Your administration has been submited.", {
			
		});
	}),

	getFile: async (req, res, next) => {
		const { id } = req.params;
		const storage = getStorage();

		const getFiles = await Administration.findOne({
			where: {
				id,
			},
			attributes: [
				"integrity_pact",
				"nin_card",
				"family_card",
				"certificate",
				"photo",
				"transcript",
				"recommendation_letter",
			],
		});

		let arrFile = Object.values(getFiles.dataValues);

		let linkFile = [];
		arrFile.map((file) => {
			getDownloadURL(ref(storage, file)).then((res) => {
				linkFile.push(res);
				console.log(linkFile);
			});
		});

		return res.sendJson(200, true, "success", linkFile);
	},

	deleteAdministration: async (req, res) => {
		try {
			const { id } = req.params;
			const storage = getStorage();

			const getFiles = await Administration.findOne({
				where: {
					id,
				},
				attributes: [
					"integrity_pact",
					"nin_card",
					"family_card",
					"certificate",
					"photo",
					"transcript",
					"recommendation_letter",
				],
			});

			let arrFile = Object.values(getFiles.dataValues);

			arrFile.map((file) => {
				deleteObject(ref(storage, file));
			});

			await Administration.destroy({
				where: {
					id,
				},
			});

			return res.sendJson(200, true, "succes delete administration");
		} catch (error) {
			console.log(error);
			res.sendJson(403, false, error);
		}
	},
};
