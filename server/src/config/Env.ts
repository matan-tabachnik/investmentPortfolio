import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT),
  twelve: {
    baseUrl: process.env.TWELVE_BASE_URL,
    apiKey: process.env.TWELVE_API_KEY
  }
};
