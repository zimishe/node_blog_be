const aws = require('aws-sdk');
const pug = require('pug');
const pdfH = require('html-pdf');

aws.config.region = 'us-east-1';

const S3_BUCKET = 'node-lock-test';
const REPORTS_FOLDER = 'public/reports';

const articleCompiler = pug.compileFile(`${process.cwd()}/src/reports/article.pug`);

const generatePdf = async (htmlArgs, res) => {
  try {
    const html = articleCompiler(htmlArgs);

    pdfH.create(html)
      .toStream(async (error, stream) => {
        if (error) {
          res.status(422).send({ message: 'failed to generate pdf', error });
        }
        const s3 = new aws.S3();

        const s3Params = {
          Bucket: S3_BUCKET,
          Key: `${REPORTS_FOLDER}/${htmlArgs.title}.pdf`,
          Expires: 360,
          ContentType: 'application/pdf',
          ACL: 'public-read',
          Body: stream,
        };

        s3.upload(s3Params, (err, data) => {
          if (err) {
            res.status(422).send({ message: 'failed to upload pdf to s3', error: err });
          }
          res.status(200).send({ generatedBy: 'regular be', url: data.Location });
        });
      });
  } catch (err) {
    console.log('er', err);
  }
};

module.exports = {
  generatePdf,
};
