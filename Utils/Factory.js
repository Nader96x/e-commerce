const asyncHandler = require("express-async-handler");
const { del } = require("express/lib/application");
const AsyncHandler = require("express-async-handler");
const ApiError = require("./ApiError");
const ApiFeatures = require("./ApiFeatures");
const User = require("../Components/Users/User");

module.exports.getAll = (Model) =>
  asyncHandler(async ({ body, query, lang }, res, next) => {
    let filter = {};
    if (body.filterObject) filter = body.filterObject;

    /** BUILD query*/

    const apiFeatures = new ApiFeatures(query, Model.find(filter));
    apiFeatures.filter().sort().limitFields().search();
    const documentsCount = await Model.countDocuments(
      apiFeatures.mongooseQuery.getQuery()
    );
    apiFeatures.paginate(documentsCount);

    const { mongooseQuery, paginationResult: pagination } = apiFeatures;

    /** execute query  */
    const documents = await mongooseQuery;
    /*if (lang) {
      documents = documents.map((document) => {
        const doc = { ...document.toJSON() };
        doc.name = document[`name_${lang}`];
        doc.desc = document[`desc_${lang}`];
        if (doc.category_id) {
          doc.category_id.name = document.category_id[`name_${lang}`];
          delete doc.category_id.name_en;
          delete doc.category_id.name_ar;
        }
        delete doc.name_en;
        delete doc.desc_en;
        delete doc.name_ar;
        delete doc.desc_ar;
        console.log(doc);
        return doc;
      });
    }*/
    res
      .status(200)
      .json({ result: documents.length, pagination, data: documents });
  });

/*
 get one document handler for endpoint
  @param {Model} model
  @return {response} response {document<model>}
*/
module.exports.getOne = (Model) =>
  asyncHandler(async ({ params, opts }, res, next) => {
    const { id } = params;
    console.log(opts);
    const query = Model.findOne({ _id: id, ...opts });
    const document = await query;
    if (!document)
      return next(new ApiError(`no ${Model.modelName} for this id ${id}`, 404));

    res.status(200).json({ status: "success", data: document });
  });
module.exports.getOneBySlug = (Model) =>
  asyncHandler(async ({ params, lang }, res, next) => {
    const { slug } = params;
    const query = Model.findOne({ slug: slug });
    const document = await query;
    if (!document)
      return next(
        new ApiError(`no ${Model.modelName} for this slug ${slug}`, 404)
      );
    /*if (lang) {
      document = document.toJSON();
      document.name = document[`name_${lang}`];
      document.desc = document[`desc_${lang}`];
      if (document.category_id) {
        document.category_id.name = document.category_id[`name_${lang}`];
        delete document.category_id.name_en;
        delete document.category_id.name_ar;
      }
      delete document.name_en;
      delete document.desc_en;
      delete document.name_ar;
      delete document.desc_ar;
    }*/
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
    document.save({ validateBeforeSave: false });

    res.status(200).json({ status: "success", data: document });
  });

/*
 Delete one handler for api endpoint
  @param {Model} model
*/
module.exports.deleteOne = (Model, subModel, conditionKey) =>
  asyncHandler(async ({ params }, res, next) => {
    const { id } = params;
    if (subModel && conditionKey) {
      const condition = await subModel.find({ [conditionKey]: id });
      if (condition.length > 0) {
        return next(
          new ApiError(
            `Cannot delete ${Model.modelName} with ${subModel.modelName}`,
            400
          )
        );
      }
    }
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

module.exports.activate = (Model) =>
  AsyncHandler(async ({ params }, res, next) => {
    const { id } = params;
    const document = await Model.findByIdAndUpdate(
      id,
      { is_active: true },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!document) {
      return next(new ApiError("Activation Went Wrong", 400));
    }
    res.status(200).json({
      status: "success",
      data: document,
    });
  });

module.exports.deActivate = (Model) =>
  AsyncHandler(async ({ params }, res, next) => {
    const { id } = params;
    const document = await Model.findByIdAndUpdate(
      id,
      { is_active: false },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!document) {
      return next(new ApiError("Activation Went Wrong", 400));
    }
    res.status(200).json({
      status: "success",
      data: document,
    });
  });
