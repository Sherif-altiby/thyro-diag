import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

connectDB().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});