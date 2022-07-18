const puppeteer = require('puppeteer')
const hbs = require('handlebars')
const fs = require('fs-extra')
const path = require('path')
const toRupiah = require('./toRupiah')

const compile = async (templateName, data) => {
  const filePath = path.join(
    process.cwd(),
    'src/template',
    `${templateName}.hbs`
  )

  const html = await fs.readFile(filePath, 'utf8')

  return hbs.compile(html)(data)
}

module.exports = async (data = {}) => {
  const {
    sale,
    lease,
    service,
    purchase,
    tax,
    operational,
    otherIncome,
    month,
    year,
  } = data

  try {
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      args: [
        '--disable-gpu',
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--no-zygote',
        '--disable-dev-shm-usage',
      ],
    })

    const page = await browser.newPage()

    const totalIncome = sale + lease + service

    const total = totalIncome + purchase + tax + operational + otherIncome

    const data = {
      sale: toRupiah(sale),
      lease: toRupiah(lease),
      service: toRupiah(service),
      totalIncome: toRupiah(totalIncome),
      purchase: toRupiah(purchase),
      tax: toRupiah(tax),
      operational: toRupiah(operational),
      otherIncome: toRupiah(otherIncome),
      total: toRupiah(total),
      month,
      year,
    }

    const content = await compile('index', data)

    await page.setContent(content)
    await page.pdf({
      path: './statement/statements.pdf',
      format: 'A4',
      printBackground: true,
    })

    await browser.close()
  } catch (error) {
    console.log(error)
  }
}
