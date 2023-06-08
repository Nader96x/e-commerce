const asyncHandler = require("express-async-handler");
const ApiError = require("./ApiError");
const ApiFeatures = require("./ApiFeatures");

module.exports.getAll = (Model) =>
  asyncHandler(async ({ body, query }, res, next) => {
    let filter = {};
    if (body.filterObject) filter = body.filterObject;

    /** BUILD query*/
    const documentsCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(query, Model.find(filter));
    apiFeatures.paginate(documentsCount).filter().sort().limitFields().search();

    const { mongooseQuery, paginationResult: pagination } = apiFeatures;
    /** execute query  */
    const documents = await mongooseQuery;
    res
      .status(200)
      .json({ result: documents.length, pagination, data: documents });
  });

/*
 get one document handler for endpoint
  @param {Model} model
  @return {response} response {document<model>}
*/
module.exports.getOne = (Model, populateOption) =>
  asyncHandler(async ({ params }, res, next) => {
    const { id } = params;
    let query = Model.findById(id);
    if (populateOption) query = query.populate(populateOption);
    const document = await query;
    if (!document)
      return next(new ApiError(`no ${Model.modelName} for this id ${id}`, 404));

    res.status(200).json({ status: "success", data: document });
  });

/*
 create one handler for endpoint
 @param {Model} model
 @return {response} response {document<model>}
*/
module.exports.createOne = (Model) =>
  asyncHandler(async ({ body }, res, next) => {
    const document = await Model.create(body);
    if (!document) return next(new ApiError(` bad request`, 400));
    res.status(201).json({
      status: "success",
      data: await Model.findById(document.toJSON().id),
    });
  });

/*
 update one handler for api endpoint
 @param {Model} model
 @return {response} response {document<model>}
*/
module.exports.updateOne = (Model) =>
  asyncHandler(async ({ body, params }, res, next) => {
    const { id } = params;
    const document = await Model.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
      skipInvalidation: true,
    });
    if (!document)
      return next(new ApiError(`no ${Model.modelName} for this id ${id}`, 404));
    // tiger save event in mongoose to call handler
    document.save();

    res.status(200).json({ status: "success", data: document });
  });

/*
 Delete one handler for api endpoint
  @param {Model} model
*/
module.exports.deleteOne = (Model) =>
  asyncHandler(async ({ params }, res, next) => {
    const { id } = params;
    const document = await Model.findByIdAndDelete(id);
    if (!document)
      return next(new ApiError(`no ${Model.modelName} for this id ${id}`, 404));

    // tiger remove event in mongoose to call handler
    document.remove();
    res.status(204).json({ status: "success", data: null });
  });

module.exports.ban = (Model) =>
  asyncHandler(async ({ params, user }, res, next) => {
    const { id } = params;
    if (id === user._id)
      return next(new ApiError(`you can't ban yourself`, 400));
    const document = await Model.findByIdAndUpdate(
      id,
      {
        is_banned: true,
      },
      {
        new: true,
      }
    ).exec();
    if (!document)
      return next(new ApiError(`no ${Model.modelName} for this id ${id}`, 404));

    res.status(200).json({ status: "success", data: document });
  });

module.exports.unban = (Model) =>
  asyncHandler(async ({ params, user }, res, next) => {
    const { id } = params;
    if (id === user._id)
      return next(new ApiError(`you can't unban yourself`, 400));
    const document = await Model.findByIdAndUpdate(
      id,
      {
        is_banned: false,
      },
      {
        new: true,
      }
    ).exec();
    if (!document)
      return next(new ApiError(`no ${Model.modelName} for this id ${id}`, 404));

    res.status(200).json({ status: "success", data: document });
  });
