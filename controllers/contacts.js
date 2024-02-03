const { Contact } = require("../models/contact");
const HttpError = require("../helpers/HttpError");

const get = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { limit = 20, page = 1, favorite } = req.query;
    const skip = (page - 1) * limit;
    const isFavorite = favorite === "true";
    const result = await Contact.find(
      { owner, favorite: isFavorite },
      "name email phone favorite",
      {
        page,
        skip,
        limit,
      }
    ).populate("owner", "email subscription");
    res.json(result);
  } catch (error) {
    next(error);
  }
};
const getContactById = async (req, res, next) => {
  console.log(req.params);
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    console.log(result);
    if (!result) {
      res.status(404).json({ message: "Not found" });
    }
    res.json({
      message: "contact deleted",
    });
  } catch (error) {
    next(error);
  }
};
const updateContact = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }
    const { contactId } = req.params;
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) {
      throw new HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const keys = Object.keys(req.body);

    if (keys.length === 0) {
      throw new HttpError(400, "missing field favorite");
    }
    const { contactId } = req.params;
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  get,
  getContactById,
  addContact,
  removeContact,
  updateStatusContact,
  updateContact,
};

/*
const addSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Missing required name field",
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required()
    .messages({
      "any.required": "Missing required email field",
    }),
  phone: Joi.number().required().messages({
    "any.required": "Missing required phone field",
  }),
});

const updateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.number(),
});
*/
