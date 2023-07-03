const db = require("../../data/db-config");
const accountsModel = require("./accounts-model");
const router = require("express").Router();
const mw = require("./accounts-middleware");

router.get("/", async (req, res, next) => {
  try {
    const allAccounts = await accountsModel.getAll();
    res.json(allAccounts);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", mw.checkAccountId, (req, res, next) => {
  try {
    res.json(req.existAccount);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  mw.checkAccountPayload,
  mw.checkAccountNameUnique,
  async (req, res, next) => {
    try {
      const insertAccountModel = {
        name: req.body.name,
        budget: req.body.budget,
      };
      const insertedAccount = await accountsModel.create(insertAccountModel);
      res.status(201).json(insertedAccount);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  mw.checkAccountId,
  mw.checkAccountPayload,
  mw.checkAccountNameUnique,
  async (req, res, next) => {
    try {
      const updateAccountModel = {
        name: req.body.name,
        budget: req.body.budget,
      };
      const updatedAccount = await accountsModel.updateById(
        req.params.id,
        updateAccountModel
      );
      res.status(200).json(updatedAccount);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id", mw.checkAccountId, async (req, res, next) => {
  try {
    await accountsModel.deleteById(req.params.id);
    res.json({ message: `${req.params.id}'li kayıt silindi.` });
  } catch (error) {
    next(error);
  }
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    customMessage: "Global error handler üzerinde hata oluştu",
    message: err.message,
  });
});

module.exports = router;
