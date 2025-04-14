import dotenv from "dotenv";
dotenv.config();
import verifyUrl from "../validators/verifyUrl.js"
import urlModel from "../models/url.model.js";
import userModel from "../models/user.model.js";
import { customAlphabet } from "nanoid";
const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
const createUrl = async (req, res) => {
  try {
    const { url, name } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    if(!verifyUrl(url)){
      return res.status(400).json({ error: "URL invalid" });

    }
    const nanoid = customAlphabet(alphabet, 7); // longitud 7
    const id = nanoid(); // ejemplo: 'hauw431'

    const newUrl = new urlModel({
      url,
      name,
      custom: id,
      author: req.userId, // id del usuario que creó la URL
    });

    const urlSave = await newUrl.save();

    // Buscar al usuario autor por su ID
    const userAuthor = await userModel.findById(req.userId);

    if (userAuthor) {
      userAuthor.userUrls.push(urlSave._id);
      await userAuthor.save();
    }

    res.status(201).json(newUrl);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getUrls = async (req, res) => {
  try {
    const idUrl = req.params.idUrl;
    const urls = await urlModel.findOne({ custom: idUrl });

    if (!urls) {
      return res.status(404).json({ error: "URL not found" });
    }

    const cincoHorasEnMs = 5 * 60 * 60 * 1000;
    const ahora = Date.now();
    const tiempoDeCreacion = new Date(urls.createdAt).getTime();
    if (urls.tempo) {
      if (ahora - tiempoDeCreacion >= cincoHorasEnMs) {
        // Si está expirada, eliminarla manualmente
        await urlModel.deleteOne({ _id: urls._id });

        return res.status(410).json({ error: "URL expired and deleted" });
      }
    }
    res.redirect(urls.url);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createURLTemp = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    if(!verifyUrl(url)){
      return res.status(400).json({ error: "URL invalid" });

    }

    const nanoid = customAlphabet(alphabet, 7); // longitud 7
    const id = nanoid(); // ejemplo: 'hauw431'
    const urlTemp = new urlModel({
      url,
      custom: id,
      tempo: true, // Indica que es temporal
    });
    const urlSave = await urlTemp.save();
    res.status(201).json(urlSave);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deletedUrl = async (req, res) => {
  try {
    const { ide } = req.params;
    const url = await urlModel.findByIdAndDelete(ide);

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    // Eliminar la URL del array userUrls del autor
    const userAuthor = await userModel.findById(req.userId);
    if (userAuthor) {
      userAuthor.userUrls.pull(url._id);
      await userAuthor.save();
    }

    res.status(200).json({ message: "URL deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const updateUrl = async (req, res) => {
  try {
    const { idUrl } = req.params;
    const { url, name } = req.body;

    const urlDB = await urlModel.findById(idUrl);

    if (!urlDB) {
      return res.status(404).json({ error: "URL not found" });
    }

    if (urlDB.author.toString() !== req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (url) urlDB.url = url;
    if (name) urlDB.name = name;

    const updatedUrl = await urlDB.save();

    res.status(200).json(updatedUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { createUrl, getUrls, deletedUrl, updateUrl, createURLTemp };
