const express = require("express");
const models = require("../db/models");
const routeUtils = require("./utils");
const constants = require("../data/constants");
const shortid = require("shortid");
const logger = require("../modules/logging")(".");
const router = express.Router();

// param: editing - flag for edit instead of create
// param: id - id of deck, only required when editing
// param: name - name of deck
// param: profiles - JSON [{ name: x, avatar: y, deathMessage: z}, { name: x2, avatar: y2, deathMessage: z2}]
router.post("/create", async function (req, res) {
  try {
    const userId = await routeUtils.verifyLoggedIn(req);
    var user = await models.User.findOne({ id: userId, deleted: false }).select(
      "itemsOwned anonymousDecks"
    );
    user = user.toJSON();

    if (
      !req.body.editing &&
      user.anonymousDecks.length >= user.itemsOwned.anonymousDeck
    ) {
      res.status(500);
      res.send("You need to purchase more anonymous decks from the shop.");
      return;
    }

    if (
      !req.body.editing &&
      user.anonymousDecks.length >= constants.maxOwnedAnonymousDecks
    ) {
      res.status(500);
      res.send(
        `You can only have up to ${constants.maxOwnedAnonymousDecks} created anonymous decks linked to your account.`
      );
      return;
    }

    if (req.body.editing) {
      var foundDeck = await models.AnonymousDeck.findOne({
        id: String(req.body.id),
      })
        .select("creator")
        .populate("creator", "id");

      if (!foundDeck || foundDeck.creator.id != userId) {
        res.status(500);
        res.send("You can only edit decks you have created.");
        return;
      }
    }

    let deck = Object(req.body);
    deck.name = String(deck.name || "");
    deck.profiles = Object(deck.profiles);

    // deck name
    if (!deck.name || !deck.name.length) {
      res.status(500);
      res.send("You must give your deck a name.");
      return;
    }
    if (deck.name.length > constants.maxDeckNameLength) {
      res.status(500);
      res.send("Deck name is too long.");
      return;
    }

    // profiles
    var [result, newProfiles] = verifyDeckProfiles(deck.profiles);
    if (result != true) {
      if (result == "Invalid deck data")
        logger.warn(
          `Bad deck data: \n${userId}\n${JSON.stringify(deck.profiles)}`
        );

      res.status(500);
      res.send(result);
      return;
    }
    deck.profiles = JSON.stringify(newProfiles);

    if (req.body.editing) {
      await models.AnonymousDeck.updateOne(
        { id: deck.id },
        { $set: deck }
      ).exec();
      res.send(req.body.id);
      return;
    }

    deck.id = shortid.generate();
    deck.creator = req.session.user._id;

    deck = new models.AnonymousDeck(deck);
    await deck.save();
    await models.User.updateOne(
      { id: userId },
      { $push: { anonymousDecks: deck._id } }
    ).exec();
    res.send(deck.id);
  } catch (e) {
    logger.error(e);
    res.status(500);
    res.send("Unable to make deck.");
  }
});

router.post("/delete", async function (req, res) {
  try {
    const userId = await routeUtils.verifyLoggedIn(req);
    let deckId = String(req.body.id);

    let deck = await models.AnonymousDeck.findOne({
      id: deckId,
    })
      .select("_id id name creator")
      .populate("creator", "id");

    if (!deck || deck.creator.id != userId) {
      res.status(500);
      res.send("You can only delete decks you have created.");
      return;
    }

    await models.AnonymousDeck.deleteOne({
      id: deckId,
    }).exec();
    await models.User.updateOne(
      { id: deck.creator.id },
      { $pull: { anonymousDecks: deck._id } }
    ).exec();

    res.send(`Deleted deck ${deck.name}`);
    return;
  } catch (e) {
    logger.error(e);
    res.status(500);
    res.send("Unable to delete anonymous deck.");
  }
});

router.post("/disable", async function (req, res) {
  try {
    const userId = await routeUtils.verifyLoggedIn(req);
    let deckId = req.body.deckId;

    if (
      !(await routeUtils.verifyPermission(res, userId, "disableAnonymousDeck"))
    ) {
      return;
    }

    let deck = await models.AnonymousDeck.findOne({ id: deckId });
    if (!deck) {
      res.status(500);
      res.send("Deck not found.");
      return;
    }

    await models.AnonymousDeck.updateOne(
      { id: deckId },
      { disabled: !deck.disabled }
    ).exec();

    routeUtils.createModAction(userId, "Toggle Disabled Anonymous Deck", [
      deckId,
    ]);
    res.sendStatus(200);
  } catch (e) {
    logger.error(e);
    res.status(500);
    res.send("Unable to toggle disable on anonymous deck.");
  }
});

router.post("/feature", async function (req, res) {
  try {
    const userId = await routeUtils.verifyLoggedIn(req);
    let deckId = req.body.deckId;

    if (
      !(await routeUtils.verifyPermission(res, userId, "featureSetup"))
    ) {
      return;
    }

    let deck = await models.AnonymousDeck.findOne({ id: deckId });
    if (!deck) {
      res.status(500);
      res.send("Deck not found.");
      return;
    }

    await models.AnonymousDeck.updateOne(
      { id: deckId },
      { featured: !deck.featured }
    ).exec();

    routeUtils.createModAction(userId, "Toggle Featured Deck", [
      deckId,
    ]);
    res.sendStatus(200);
  } catch (e) {
    logger.error(e);
    res.status(500);
    res.send("Unable to toggle feature on anonymous deck.");
  }
});

router.get("/featured", async function (req, res) {
  res.setHeader("Content-Type", "application/json");
  try {
    var userId = await routeUtils.verifyLoggedIn(req, true);
    var pageSize = 7;
    var pageLimit = 10;
    var start = ((Number(req.query.page) || 1) - 1) * pageSize;
    var deckLimit = pageSize * pageLimit;

    if (start < deckLimit) {
      let decks = await models.AnonymousDeck.find({ featured: true })
        .skip(start)
        .limit(pageSize)
        .select("id name featured profiles");
      let count = await models.AnonymousDeck.countDocuments({
        featured: true,
      });

      res.send({
        decks: decks,
        pages: Math.min(Math.ceil(count / pageSize), pageLimit) || 1,
      });
    } else res.send({ decks: [], pages: 0 });
  } catch (e) {
    logger.error(e);
    res.send({ decks: [], pages: 0 });
  }
});

router.get("/search", async function (req, res) {
  res.setHeader("Content-Type", "application/json");
  try {
    var userId = await routeUtils.verifyLoggedIn(req, true);
    var pageSize = 7;
    var pageLimit = 5;
    var start = ((Number(req.query.page) || 1) - 1) * pageSize;
    var deckLimit = pageSize * pageLimit;

    if (start < deckLimit) {
      var decks = await models.AnonymousDeck.find({
        name: { $regex: String(req.query.query), $options: "i" },
        gameType,
      })
        .sort("played")
        .limit(deckLimit)
        .select("id gameType name roles closed count featured -_id");
      var count = decks.length;
      decks = decks.slice(start, start + pageSize);

      res.send({
        decks: decks,
        pages: Math.min(Math.ceil(count) / pageSize, pageLimit) || 1,
      });
    } else res.send({ decks: [], pages: 0 });
  } catch (e) {
    logger.error(e);
    res.send({ decks: [], pages: 0 });
  }
});

router.get("/yours", async function (req, res) {
  res.setHeader("Content-Type", "application/json");
  try {
    var userId = await routeUtils.verifyLoggedIn(req);
    var pageSize = 7;
    var start = ((Number(req.query.page) || 1) - 1) * pageSize;
    var deckLimit = constants.maxOwnedAnonymousDecks;
    var pageLimit = Math.ceil(deckLimit / pageSize);

    if (!userId) {
      res.send({ decks: [], pages: 0 });
      return;
    }

    let user = await models.User.findOne({ id: userId, deleted: false })
      .select("anonymousDecks")
      .populate({
        path: "anonymousDecks",
        select: "id name profiles featured -_id",
        options: { limit: deckLimit },
      });

    if (!user) {
      res.send({ decks: [], pages: 0 });
      return;
    }

    let decks = user.anonymousDecks;
    let count = decks.length;
    decks = decks.reverse().slice(start, start + pageSize);

    res.send({
      decks: decks,
      pages: Math.min(Math.ceil(count / pageSize), pageLimit),
    });
  } catch (e) {
    logger.error(e);
    res.send({ decks: [], pages: 0 });
  }
});

router.get("/:id", async function (req, res) {
  res.setHeader("Content-Type", "application/json");
  try {
    let deckId = String(req.params.id);
    let deck = await models.AnonymousDeck.findOne({ id: deckId })
      .select("id name creator profiles disable featured")
      .populate("creator", "id name avatar -_id");

    if (deck) {
      deck = deck.toJSON();
      res.send(deck);
    } else {
      res.status(500);
      res.send("Unable to find anonymous deck.");
    }
  } catch (e) {
    logger.error(e);
    res.status(500);
    res.send("Unable to find anonymous deck.");
  }
});

function verifyDeckProfiles(profiles) {
  if (!profiles || profiles.length < constants.minDeckSize) {
    return ["Please add more anonymous profiles."];
  }

  if (profiles.length > constants.maxDeckSize) {
    return ["Too many anonymous profiles added."];
  }

  let newProfiles = [];
  let names = {};
  for (let p of profiles) {
    if (!p.name) {
      return ["Found empty anonymous profile name."];
    }

    if (names[p.name]) {
      return [`Duplicate name found: ${p.name}`];
    }
    names[p.name] = true;

    if (p.name.length > constants.maxNameLengthInDeck) {
      return [
        `Anonymous profile  is too long: ${p.name.substring(
          0,
          constants.maxNameLengthInDeck
        )}...`,
      ];
    }

    // TODO avatar
    // TODO deathMessage

    pNew = {
      name: p.name,
      avatar: p.avatar,
      deathMessage: p.deathMessage,
    };

    newProfiles.push(pNew);
  }

  return [true, newProfiles];
}

module.exports = router;
