const aws = require('aws-sdk');

aws.config.region = 'us-east-1';

const REPORTS_FOLDER = 'public/reports';
const S3_BUCKET = 'node-lock-test';

const uploadToS3 = async (body, title) => {
  let result;
  const s3 = new aws.S3();

  const s3Params = {
    Bucket: S3_BUCKET,
    Key: `${REPORTS_FOLDER}/${title}.pdf`,
    Expires: 360,
    ContentType: 'application/pdf',
    ACL: 'public-read',
    Body: body,
  };

  try {
    const response = await s3.upload(s3Params).promise();
    result = { Location: response.Location };
  } catch (err) {
    console.error(err);
  }

  return result;
};

module.exports = {
  uploadToS3,
};
