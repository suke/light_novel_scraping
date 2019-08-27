const puppeteer = require('puppeteer')

const contentSelector = '.p-books-media02'
const imageSelector = '.p-books-media02__img'
const titleSelector = '.p-books-media__title'
const authorSelector = '.p-books-media__authors > .p-books-media__authors-item:nth-of-type(1) > a'
const illustratorSelector = '.p-books-media__authors > .p-books-media__authors-item:nth-of-type(2) > a'
const isbnSelector = '.p-books-media02__info > tbody > tr:first-child > td:nth-child(2)'
const releaseDateSelector = '.p-books-media02__info > tbody > tr:nth-child(2) > td'
const priceSelector = '.p-books-media02__info > tbody > tr:nth-child(2) > td:nth-of-type(2)'

// TODO: prettierで無名関数が上手くフォーマットされない
async function main() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://dengekibunko.jp/product/2019/08/', {
    waitUntil: 'networkidle2',
  })

  const items = await page.$$(contentSelector)

  const ret = []
  for (const item of items) {
    const image = await item.$eval(imageSelector, element => element.src)
    const title = await item.$eval(titleSelector, element => element.textContent)
    const author = await item.$eval(authorSelector, element => element.textContent)
    const illustrator = await item.$eval(illustratorSelector, element => element.textContent)
    const isbn = await item.$eval(isbnSelector, element => element.textContent)
    const releaseDate = await item.$eval(releaseDateSelector, element =>
      element.textContent.replace(/発売/g, '').trim()
    )
    const price = await item.$eval(priceSelector, element => element.textContent.replace(/[^0-9]/g, ''))

    ret.push({
      image,
      title,
      author,
      illustrator,
      isbn,
      releaseDate,
      price,
    })
  }

  console.log(ret)

  await browser.close()
}

main()
