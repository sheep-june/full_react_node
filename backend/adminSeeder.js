const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./src/models/Admin'); // 상대 경로 주의

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ DB 연결됨");

    await Admin.deleteMany({}); // 기존 관리자 전부 삭제 (원하면 생략)

    await Admin.create({
      email: 'admin@example.com',
      password: 'admin123', // 암호화는 Admin 모델에서 pre-save hook으로 진행됨
    });

    console.log("✅ 관리자 계정 생성 완료!");
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
