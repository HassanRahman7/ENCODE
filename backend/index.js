require('dotenv').config();
const express = require('express');
const cors = require('cors');
const analyzeRoute = require('./routes/analyze');
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;
const Redis = require('ioredis');

const app = express();
const PORT = process.env.PORT || 3000;

// A. Connect to Upstash Redis (Safe Mode for Node v22+)
const redisClient = new Redis(process.env.REDIS_URL, {
    family: 0,           // ⚠️ Force IPv4 (Fixes network connection errors)
    tls: {
        rejectUnauthorized: false // Fixes SSL handshake errors
    },
    maxRetriesPerRequest: null, // Keeps trying instead of crashing the app
    retryStrategy(times) {
        // Reconnect strategy: wait 50ms, then 100ms... maxing at 2 seconds
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

redisClient.on('error', (err) => {
    // Log error but don't crash
    console.log('Redis Connection Error (Check WiFi/Firewall):', err.message);
});

// B. Create the Rule (5 scans per 15 mins)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { 
        error: "Too many requests", 
        message: "You have used up your free scans. Wait 15 mins!" 
    },
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
    }),
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/analyze', limiter, analyzeRoute);

// Basic health check
app.get('/', (req, res) => {
  res.send('AI Ingredient Copilot Backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});