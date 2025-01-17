const paginate = async (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  // If the query is an aggregation pipeline or doesn't support `.getFilter`
  if (typeof query.skip !== 'function' || typeof query.model === 'undefined') {
    const results = await query.skip(skip).limit(limit);
    return {
      total: results.length, // Aggregation queries don't support counting directly
      page,
      pageSize: results.length,
      data: results,
    };
  }

  // For standard queries with `.getFilter`
  const results = await query.skip(skip).limit(limit);
  const total = await query.model.countDocuments(query.getFilter());
  
  return {
    total,
    page,
    pageSize: results.length,
    data: results,
  };
};

module.exports = paginate;
