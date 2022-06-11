const fs = require('fs')
const easyinvoice = require('easyinvoice')

const createCustomerObject = (customer) => {
  const customerObj = {}

  customerObj.company = customer.name
  customerObj.zip = customer.cp
  customerObj.city = customer.phone
  customerObj.address = customer.address
  customerObj.country = 'Indonesia'

  return customerObj
}

const addDays = (date, days) => {
  let result = new Date(date)
  result.setDate(result.getDate() + days)
  return result.toLocaleDateString('id-ID')
}

module.exports = async (data = {}) => {
  const { customer, item, id, tax, notice } = data

  const now = new Date()

  const invoiceNumber = `${now
    .toLocaleDateString('id-ID')
    .split('/')
    .join('')}${id}`

  const date = now.toLocaleDateString('id-ID')
  const client = createCustomerObject(customer)

  const dueDate = addDays(now, 20)

  // migrate product
  const product = [{
    quantity: item.quantity,
    description: item.name,
    'tax-rate': tax,
    price: item.price
  }]

  const invoiceData = {
    "images": {
      "logo": "https://i.ibb.co/qDHB6V1/logo-servindo.png",
    },
    sender: {
      company: 'CV. Servindo',
      address: 'Jl. Seroja 2 no.4',
      zip: '45366',
      city: 'Sumedang',
      country: 'Indonesia',
    },
    client,
    information: {
      number: invoiceNumber,
      date,
      'due-date': dueDate
    },
    products: product,
    'bottom-notice': `Thank you for your ${notice}`,
    settings: {
      locale: 'id-ID',
      currency: 'IDR',
      'tax-notation': 'vat',
      'margin-top': 25,
      'margin-right': 25,
      'margin-left': 25,
      'margin-bottom': 25,
    }
  }

  const result = await easyinvoice.createInvoice(invoiceData)

  const fileName = `${invoiceNumber}.pdf`

  fs.writeFileSync(`invoice/${fileName}`, result.pdf, 'base64')

  return fileName
}
