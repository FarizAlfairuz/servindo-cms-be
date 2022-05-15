const handleUniqueViolation = (errors) => {
  const notUniqueFields = {}

  if (errors.errors) {
    errors.errors.forEach((field) => {
      notUniqueFields[field.path] = {
        path: field.path,
        value: field.value,
        type: field.type,
        message: field.message,
      }
    })
  }

  const handledErrors = {
    type: 'UniqueViolation',
    fields: notUniqueFields,
  }

  return handledErrors
}

module.exports = { handleUniqueViolation }
