const User = require("./User");

exports.getAllAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new Error("User Not Found"));
    }
    const addresses = user.address;
    res.status(200).json({
      status: "success",
      data: addresses,
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
      data: address,
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
    await user.address.push(req.body);
    await user.save();
    res.status(201).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateAddress = async (req, res, next) => {
  const userId = req.params.id;
  const addressId = req.params.address;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new Error("User Not Found"));
    }
    const userAddress = await user.address.find((address) =>
      address._id.equals(addressId)
    );
    if (!userAddress) {
      return next(new Error("Address Not Found"));
    }
    // userAddress = { ...userAddress, ...req.body };
    Object.assign(userAddress, req.body);
    await user.save();
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteAddress = async (req, res, next) => {
  const userId = req.params.id;
  const addressId = req.params.address;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new Error("User Not Found"));
    }
    const userAddress = await user.address.find((address) =>
      address._id.equals(addressId)
    );
    if (!userAddress) {
      return next(new Error("Address Not Found"));
    }
    const addressIndex = await user.address.findIndex(
      ({ _id }) => _id == addressId
    );
    await user.address.splice(addressIndex, 1);
    await user.save({ validateBeforeSave: true });
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