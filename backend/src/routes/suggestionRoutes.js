const express = require("express");
const router = express.Router();

// Popular travel destinations as suggestions
const SUGGESTIONS = [
  { id: "india_goa", name: "Goa", country: "India", description: "Beaches, nightlife, and Portuguese heritage by the Arabian Sea.", rating: 4.6, estimatedBudget: 900, imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80" },
  { id: "india_kerala", name: "Kerala", country: "India", description: "God's Own Country — backwaters, tea estates, and serene beaches.", rating: 4.7, estimatedBudget: 850, imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80" },
  { id: "india_rajasthan", name: "Rajasthan", country: "India", description: "Land of kings — forts, palaces, and golden sand dunes.", rating: 4.5, estimatedBudget: 780, imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80" },
  { id: "japan_tokyo", name: "Tokyo", country: "Japan", description: "Ultra-modern metropolis blending ancient temples with neon streets.", rating: 4.8, estimatedBudget: 2400, imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80" },
  { id: "france_paris", name: "Paris", country: "France", description: "The City of Light — romance, art, and world-class cuisine.", rating: 4.7, estimatedBudget: 2100, imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80" },
  { id: "indonesia_bali", name: "Bali", country: "Indonesia", description: "Tropical paradise with temples, terraces, and surf.", rating: 4.6, estimatedBudget: 1400, imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80" },
  { id: "uae_dubai", name: "Dubai", country: "UAE", description: "Futuristic skyline, luxury malls, and desert adventures.", rating: 4.5, estimatedBudget: 2600, imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80" },
  { id: "thailand_bangkok", name: "Bangkok", country: "Thailand", description: "Vibrant street food, grand temples, and endless markets.", rating: 4.5, estimatedBudget: 1100, imageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80" },
];

router.get("/", (req, res) => {
  const country = req.query.country;
  let results = SUGGESTIONS;
  if (country) {
    results = SUGGESTIONS.filter(s => s.country.toLowerCase().includes(country.toLowerCase()));
    if (results.length === 0) results = SUGGESTIONS;
  }
  res.status(200).json({ success: true, data: results });
});

module.exports = router;
