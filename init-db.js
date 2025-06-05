const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const defaultUsers = [
  {
    name: "Super Admin",
    email: "superadmin@example.com",
    password: "superadmin123",
    role: "super_admin",
  },
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Regular User",
    email: "user@example.com",
    password: "user123",
    role: "user",
  },
];

const initializeDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Create default users
    for (const userData of defaultUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${userData.email}`);
    }

    console.log("Database initialized successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
};

initializeDB();
