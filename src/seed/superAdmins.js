const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin/Admin");
require("dotenv").config();

async function seedSuperAdmins() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const superAdmins = [
      {
        name: "Arif",
        email: "arifishtiaque.sparktech@gmail.com",
        password: "admin123",
      },
      {
        name: "Bigna",
        email: "bisegen362@misehub.com",
        password: "admin456",
      }
    ];

    for (const admin of superAdmins) {
      const exists = await Admin.findOne({ email: admin.email });
      if (!exists) {
        const hashed = await bcrypt.hash(admin.password, 10);
        await Admin.create({
          ...admin,
          password: hashed,
          role: "SUPER_ADMIN",
          isVerified: true,
        });
        console.log(`✅ Created SUPER_ADMIN: ${admin.email}`);
      } else {
        console.log(`⚠️ Already exists: ${admin.email}`);
      }
    }

    console.log("🎉 Done!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding:", err);
    process.exit(1);
  }
}

seedSuperAdmins();
