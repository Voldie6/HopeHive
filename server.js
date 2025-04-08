const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (Replace with your Atlas URL)
mongoose.connect('mongodb+srv://mohammeedibrahim0216:<db_password>@hopehive.zwxfer9.mongodb.net/?retryWrites=true&w=majority&appName=HopeHive')
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => console.log("MongoDB Error:", err));

// User Schema (for Auth)
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  donations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Donation' }]
});
const User = mongoose.model('User', UserSchema);

// Campaign Schema
const CampaignSchema = new mongoose.Schema({
  title: String,
  description: String,
  targetAmount: Number,
  raisedAmount: { type: Number, default: 0 },
  image: String
});
const Campaign = mongoose.model('Campaign', CampaignSchema);

// Donation Schema
const DonationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  amount: Number,
  date: { type: Date, default: Date.now }
});
const Donation = mongoose.model('Donation', DonationSchema);

// JWT Secret Key
const JWT_SECRET = 'your_jwt_secret_keep_it_safe';

// Auth Routes
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: "User registered!" });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user._id }, JWT_SECRET);
  res.json({ token, user: { name: user.name, email: user.email } });
});

// Campaign Routes
app.get('/api/campaigns', async (req, res) => {
  const campaigns = await Campaign.find();
  res.json(campaigns);
});

app.post('/api/donate', async (req, res) => {
  const { userId, campaignId, amount } = req.body;
  const donation = await Donation.create({ user: userId, campaign: campaignId, amount });
  await Campaign.findByIdAndUpdate(campaignId, { $inc: { raisedAmount: amount } });
  res.status(201).json({ message: "Donation successful!" });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});