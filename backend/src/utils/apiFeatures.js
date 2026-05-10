class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObject = { ...this.queryString };
    ["page", "sort", "limit", "fields", "keyword"].forEach((field) => delete queryObject[field]);

    this.query = this.query.find(queryObject);
    return this;
  }

  search(fields = []) {
    if (this.queryString.keyword && fields.length > 0) {
      const keyword = {
        $regex: this.queryString.keyword,
        $options: "i"
      };

      this.query = this.query.find({
        $or: fields.map((field) => ({ [field]: keyword }))
      });
    }

    return this;
  }

  sort() {
    const sortBy = this.queryString.sort ? this.queryString.sort.split(",").join(" ") : "-createdAt";
    this.query = this.query.sort(sortBy);
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;

