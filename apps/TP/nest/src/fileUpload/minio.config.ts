import * as Minio from 'minio';

export const minioConfig = {
  endPoint: process.env.MINIO_HOST ,
  port: Number(process.env.MINIO_PORT),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESSKEY,
  secretKey: process.env.MINIO_SECRETKEY,
};

const minioClient = new Minio.Client(minioConfig);

export default minioClient;