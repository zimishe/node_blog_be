const aws = require('aws-sdk');
const pug = require('pug');
const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

aws.config.region = 'us-east-1';

const S3_BUCKET = 'node-lock-test';
const REPORTS_FOLDER = 'public/reports';

const articleCompiler = pug.compileFile(`${process.cwd()}/src/reports/article.pug`);

const generatePdf = async htmlArgs => {
  let response;
  try {
    const html = articleCompiler(htmlArgs);

    const browser = await puppeteer.launch({
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

    const s3 = new aws.S3();

    const s3Params = {
      Bucket: S3_BUCKET,
      Key: `${REPORTS_FOLDER}/${htmlArgs.title}.pdf`,
      Expires: 360,
      ContentType: 'application/pdf',
      ACL: 'public-read',
      Body: pdf,
    };

    response = await s3.upload(s3Params).promise();
  } catch (err) {
    console.log('er', err);
  }

  return response;
};

module.exports = {
  generatePdf,
};
