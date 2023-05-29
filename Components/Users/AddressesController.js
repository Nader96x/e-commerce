const { User, Address } = require("./User");

exports.getAllAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
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

exports.addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    await user.address.push(await Address.create(req.body));
    await user.update(user);
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
