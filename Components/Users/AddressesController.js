const { User, Address } = require("./User");

exports.getAllAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new Error("User Not Found"));
    }
    const addresses = user.address;
    console.log(addresses);
    res.status(200).json({
      status: "success",
      data: {
        addresses,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new Error("User Not Found"));
    }
    const address = await user.address.filter(
      (el) => el._id == req.params.address
    );
    if (address.length === 0) {
      return next(new Error("Address Not Found"));
    }
    res.status(200).json({
      status: "success",
      data: {
        address,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fails",
      message: err,
    });
  }
};

exports.addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new Error("User Not Found"));
    }
    await user.address.push(await Address.create(req.body));
    await user.save();
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new Error("User Not Found"));
    }
    const address = await user.address.filter(
      (el) => el._id == req.params.address
    );
    if (address.length === 0) {
      return next(new Error("Address Not Found"));
    }
    if (user.address.length === 1) {
      return next(new Error("Cannot Delete your only address"));
    }
    const addressIndex = await user.address.findIndex(
      ({ _id }) => _id == req.params.address
    );
    await user.address.splice(addressIndex, 1);
    user.save();
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fails",
      message: err,
    });
  }
};
