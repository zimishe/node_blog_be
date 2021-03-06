const aws = require('aws-sdk');

aws.config.region = 'us-east-1';
const { S3_BUCKET } = process.env;
const PUBLIC_FOLDER = 'public';

const getSignedUrl = async (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];

  const s3Params = {
    Bucket: S3_BUCKET,
    Key: `${PUBLIC_FOLDER}/${fileName}`,
    Expires: 360,
    ContentType: fileType,
    ACL: 'public-read',
  };

  // eslint-disable-next-line consistent-return
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${PUBLIC_FOLDER}/${fileName}`,
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
};

module.exports = {
  getSignedUrl,
};
