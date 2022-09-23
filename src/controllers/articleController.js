const { Article } = require("../models");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");
const {
  getStorage,
  ref,
  getDownloadURL,
  deleteObject,
} = require("firebase/storage");

module.exports = {
  /**
   * @desc      Get All data Article
   * @route     GET /api/v1/article/index
   * @access    Private
   */
  index: async (req, res) => {
    try {
      const data = await Article.findAll();
      const getNameFile = await Article.findAll({
        attributes: ["image"],
      });
      const storage = getStorage();

      let docLink = [];
      getNameFile.forEach((file) => {
        docLink.push(file.dataValues.image);
      });

      let resultLink = [];
      docLink.forEach((linkFile) => {
        getDownloadURL(ref(storage, linkFile)).then((res) => {
          resultLink.push(res);
        });
      });

      console.log(resultLink);

      if (data.length == 0) {
        return res.sendJson(
          200,
          true,
          "success get, but not have data article"
        );
      }

      return res.sendJson(200, true, "success get all data", docLink);
    } catch (error) {
      console.log(error);
      return res.sendJson(403, false, error, {});
    }
  },

  /**
   * @desc      Create a new data article
   * @route     POST /api/v1/article/create
   * @access    Private
   */
  create: async (req, res) => {
    try {
      const { title, description } = req.body;
      console.log(req.file);
      const bucket = admin.storage().bucket();

      const articleFile =
        uuidv4() + "-" + req.file.originalname.split(" ").join("-");
      const articleBuffer = req.file.buffer;

      bucket
        .file(`images/article/${articleFile}`)
        .createWriteStream()
        .end(articleBuffer);

      const created = await Article.create({
        title,
        description,
        image: `images/article/${articleFile}`,
      });

      return res.sendJson(201, true, "success create new article", {
        title: created.title,
        description: created.description,
        image: created.image,
      });
    } catch (error) {
      console.log(error);
      return res.sendJson(403, false, error, {});
    }
  },

  /**
   * @desc      Update data article
   * @route     PUT /api/v1/article/update
   * @access    Private
   */
  update: async (req, res) => {
    try {
      const { title, description } = req.body;
      const { uuid } = req.params;
      const storage = getStorage();
      const bucket = admin.storage().bucket();

      const findFile = await Article.findOne({
        where: {
          id: uuid,
        },
      });

      if (req.file) {
        if (findFile == null) {
          return res.sendJson(400, false, "can't find article");
        }

        deleteObject(ref(storage, findFile.image));

        const articleUpdateFile =
          uuidv4() + "-" + req.file.originalname.split(" ").join("-");
        const articleUpdateBuffer = req.file.buffer;

        bucket
          .file(`images/article/${articleUpdateFile}`)
          .createWriteStream()
          .end(articleUpdateBuffer);

        await Article.update(
          {
            image: `images/article/${articleUpdateFile}`,
          },
          {
            where: {
              id: uuid,
            },
          }
        );
      }

      if (findFile == null) {
        return res.sendJson(400, false, "can't find article");
      }
      const updated = await Article.update(
        {
          title,
          description,
        },
        {
          where: {
            id: uuid,
          },
        }
      );

      if (updated == 0) {
        return res.sendJson(
          204,
          false,
          "can't update because there no have value article"
        );
      }
      return res.sendJson(200, true, "succes update article");
    } catch (error) {
      console.log(error);
      return res.sendJson(403, false, error, {});
    }
  },

  /**
   * @desc      Delete data article
   * @route     DELETE /api/v1/article/delete/:id
   * @access    Private
   */
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const storage = getStorage();

      const findArticle = await Article.findOne({
        where: {
          id,
        },
      });

      if (findArticle == null) {
        return res.sendJson(400, false, "article not found");
      }

      deleteObject(ref(storage, findArticle.image));
      await Article.destroy({
        where: {
          id,
        },
      });

      return res.sendJson(200, true, "success delete article");
    } catch (error) {
      console.log(error);
      return res.sendJson(403, false, error, {});
    }
  },
};
