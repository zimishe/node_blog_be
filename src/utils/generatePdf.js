const aws = require('aws-sdk');
const pug = require('pug');
const pdfH = require('html-pdf');

aws.config.region = 'us-east-1';

const S3_BUCKET = 'node-lock-test';
const REPORTS_FOLDER = 'public/reports';

const articleCompiler = pug.compileFile(`${process.cwd()}/src/reports/article.pug`);

const generatePdf = async htmlArgs => {
  try {
    const html = articleCompiler(htmlArgs);

    pdfH.create(html)
      .toStream(async (error, stream) => {
        const s3 = new aws.S3();

        const s3Params = {
          Bucket: S3_BUCKET,
          Key: `${REPORTS_FOLDER}/${htmlArgs.title}-${new Date()}.pdf`,
          Expires: 360,
          ContentType: 'application/pdf',
          ACL: 'public-read',
          Body: stream,
        };

        const response = await s3.upload(s3Params).promise();

        return response;
      });
  } catch (err) {
    console.log('er', err);
  }
};

module.exports = {
  generatePdf,
};
