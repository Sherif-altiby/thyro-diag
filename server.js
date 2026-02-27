import dotenv from 'dotenv';
dotenv.config();

import app        from './src/app.js';
import connectDB  from './src/config/db.js';  // 👈 default import, no {}

connectDB().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
});

export default app; // 👈 required for Vercel