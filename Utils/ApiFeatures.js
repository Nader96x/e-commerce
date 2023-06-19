class ApiFeatures {
  constructor(query, mongooseQuery) {
    this.query = query;
    this.mongooseQuery = mongooseQuery;
  }

  filter() {
    const notAllowedKeys = ["page", "limit", "sort", "fields", "keyword"];
    let queryString = { ...this.query };
    notAllowedKeys.forEach((key) => {
      delete queryString[key];
    });
    queryString = JSON.stringify(queryString).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );
    queryString = JSON.parse(queryString);
    this.mongooseQuery.where(queryString);
    return this;
  }

  sort() {
    if (this.query.sort) {
      const sortBy = this.query.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else this.mongooseQuery = this.mongooseQuery.sort("-createdAt");

    this.mongooseQuery.sort(this.query.sort);
    return this;
  }

  limitFields() {
    if (this.query.fields) {
      const fields = this.query.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields.toString());
    } else this.mongooseQuery = this.mongooseQuery.select("-__v");
    this.mongooseQuery.select(this.query.fields);
    return this;
  }

  search() {
    if (this.query.keyword) {
      const query = {};
      query.$or = [
        { name_en: { $regex: this.query.keyword, $options: "i" } },
        { name_ar: { $regex: this.query.keyword, $options: "i" } },
        { name: { $regex: this.query.keyword, $options: "i" } },
        { email: { $regex: this.query.keyword, $options: "i" } },
        { status: { $regex: this.query.keyword, $options: "i" } },
        { desc_en: { $regex: this.query.keyword, $options: "i" } },
        { desc_ar: { $regex: this.query.keyword, $options: "i" } },
      ];
      this.mongooseQuery.find(query);
      return this;
    }
  }

  paginate(countDocuments) {
    const page = this.query.page * 1 || 1;
    const limit = this.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const lastPage = page * limit;

    //  pagination result
    const paginationResult = {};
    paginationResult.current_page = page;
    paginationResult.limit = limit;
    paginationResult.total_pages = Math.ceil(countDocuments / limit);
    paginationResult.total = countDocuments;
    // next page
    if (lastPage < countDocuments) paginationResult.next = page + 1;
    //prev  page
    if (skip > 0) paginationResult.prev = page - 1;

    this.paginationResult = paginationResult;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
