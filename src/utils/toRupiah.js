module.exports = (data) => {
  if (data < 0) {
    data *= -1
  }
  const rupiah = data.toLocaleString()

  return `Rp. ${rupiah}`
}
