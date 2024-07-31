const Joi = require("joi");
const express = require("express");
const router = express.Router();
const validationMiddleware = require("../middleware/validationMiddleware");

const {
  readCards,
  filterCardsByContent,
  createCard,
  updateCard,
  deleteCard,
  deleteFilteredCards,
} = require("./card.repository");

const requestBodySchema = Joi.object().keys({
  _id: Joi.string().required(),
  content: Joi.string().required(),
});

const requestBodySchemaWithoutId = requestBodySchema.keys({
  _id: Joi.forbidden(),
});

const requestBodySchemaWithoutContent = requestBodySchema.keys({
  content: Joi.forbidden(),
});

router.get("/cards/read", async (request, response, next) => {
  try {
    const cards = await readCards();
    response.json(cards);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/cards/create",
  validationMiddleware(requestBodySchemaWithoutId),
  async (request, response, next) => {
    try {
      const card = await createCard(request.body.content);
      response.status(201).json(card);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/cards/filter",
  validationMiddleware(requestBodySchemaWithoutId),
  async (request, response, next) => {
    try {
      const limit = 10;

      if (request.query.page < 1) {
        response.status(400).json({ message: "Page is less than 1" });
      }

      const cards = await filterCardsByContent(
        request.body.content,
        request.query.page || 1,
        limit
      );

      const totalPages = Math.ceil(cards.length / limit);

      if (request.query.page > totalPages) {
        response
          .status(400)
          .json({ message: "Page number is greater than total pages" });
      }

      response.json(cards);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/cards/update",
  validationMiddleware(requestBodySchema),
  async (request, response, next) => {
    try {
      const { card, cardAfterUpdated } = await updateCard(request.body);

      if (!card) {
        response.status(404).send({ message: "Card not found" });
      }

      response.send(cardAfterUpdated);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/cards/delete",
  validationMiddleware(requestBodySchemaWithoutContent),
  async (request, response, next) => {
    try {
      const card = await deleteCard(request.body);

      if (!card) {
        response.status(404).send({ message: "Card not found" });
      }

      console.log(card);
      response.status(200).json(card);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/cards/deleteFiltered",
  validationMiddleware(Joi.array().items(requestBodySchemaWithoutContent)),
  async (request, response, next) => {
    try {
      const cards = await deleteFilteredCards(request.body);

      if (cards.length === 0) {
        response.status(404).send({ message: "Cards not found" });
      }

      response.status(200).json(cards);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
