/* eslint-disable quote-props */
const chromium = require('chrome-aws-lambda');
const pug = require('pug');
const { uploadToS3 } = require('./s3');

exports.handler = async event => {
  const htmlArgs = JSON.parse(event.body);

  const articleCompiler = pug.compileFile('reports/article.pug');
  const html = articleCompiler(htmlArgs);

  let browser = null;
  let result = null;

  /** looks like you should load fonts before launching Chrome instance
  * otherwise it will fail with some useless error like 'Socket hang up'
  */
  await chromium.font('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({
      printBackground: true,
      format: 'A4',
      displayHeaderFooter: false,
    });

    result = await uploadToS3(pdf, htmlArgs.title);
  } catch (err) {
    console.log('error', err);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  const response = {
    'statusCode': 200,
    'body': JSON.stringify(result),
    'isBase64Encoded': false,
    'headers': {},
  };

  return response;
};
