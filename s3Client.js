const AWS = require('aws-sdk');
const fs = require('fs');


async function uploadFile(fileName, filePath, mimeType) {
    const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: process.env.AWS_REGION });
    const fileContent = fs.readFileSync(filePath);

    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: fileContent,
        Tagging: "public=yes"
        //ContentType: mimeType//geralmente se acha sozinho
    };

    const data = await s3.upload(params).promise();

    return data.Location;
}

async function listObjects(filter) {
    const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: process.env.AWS_REGION });
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Prefix: decodeURIComponent(filter)
    };

    const result = await s3.listObjectsV2(params).promise();
    return result.Contents.map(item => item.Key);
}

async function deletFile(fileName) {
    const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: process.env.AWS_REGION });
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        //ContentType: mimeType//geralmente se acha sozinho
    };
    const result = await s3.deleteObject(params).promise();
    return result
}


module.exports = { uploadFile, listObjects, deletFile }