const accountsModel = require("./accounts-model");

exports.checkAccountPayload = (req, res, next) => {
  try {
    let { name, budget } = req.body;
    if (name === undefined || budget === undefined) {
      res.status(400).json({ message: "name and budget are required" });
    } else if (name.trim().length < 3 || name.trim().length > 100) {
      res
        .status(400)
        .json({ message: "name of account must be between 3 and 100" });
    } else if (typeof budget !== "number" || isNaN(budget)) {
      res.status(400).json({ message: "budget of account must be a number" });
    } else if (budget < 0 || budget > 1000000) {
      res
        .status(400)
        .json({ message: "budget of account is too large or too small" });
    } else {
      req.body.name = req.body.name.trim();
      next();
    }
  } catch (error) {
    next(error);
  }
};

exports.checkAccountNameUnique = async (req, res, next) => {
  try {
    const isExist = await accountsModel.getByName(req.body.name);
    if (isExist) {
      res.status(400).json({ message: "that name is taken" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

exports.checkAccountId = async (req, res, next) => {
  try {
    const isExistAccount = await accountsModel.getById(req.params.id);
    if (!isExistAccount) {
      res.status(404).json({ message: "account not found" });
    } else {
      req.existAccount = isExistAccount;
      next();
    }
  } catch (error) {
    next(error);
  }
};
