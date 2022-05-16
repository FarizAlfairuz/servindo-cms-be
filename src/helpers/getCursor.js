module.exports = async (model, query) => {
  const totalRows = await model.count()

  if (!query.limit) {
    return {
      hasNext: false,
      hasPrev: false,
      size: totalRows,
      totalPages: 1,
      totalRows,
    }
  }

  const totalPages = Math.ceil(totalRows / query.limit)
  const hasNext = query.page ? totalPages > query.page : totalPages > 1
  const hasPrev = query.page ? query.page > 1 : false

  return {
    hasNext,
    hasPrev,
    size: query.limit,
    totalPages,
    totalRows,
  }
}
