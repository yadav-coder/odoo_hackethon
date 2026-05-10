const getPreviousTrips = async (req, res) => {
  const trips = [
    {
      id: "prev_goa",
      destination: "Goa",
      country: "India",
      startDate: "2025-12-18",
      endDate: "2025-12-24",
      budgetSpent: 520,
      travelers: 3,
      status: "completed",
      imageUrl: "https://source.unsplash.com/featured/?goa,beach"
    },
    {
      id: "prev_paris",
      destination: "Paris",
      country: "France",
      startDate: "2025-10-02",
      endDate: "2025-10-09",
      budgetSpent: 1850,
      travelers: 2,
      status: "completed",
      imageUrl: "https://source.unsplash.com/featured/?paris,eiffel"
    },
    {
      id: "prev_tokyo",
      destination: "Tokyo",
      country: "Japan",
      startDate: "2026-01-12",
      endDate: "2026-01-20",
      budgetSpent: 2300,
      travelers: 1,
      status: "completed",
      imageUrl: "https://source.unsplash.com/featured/?tokyo,city"
    },
    {
      id: "prev_bali",
      destination: "Bali",
      country: "Indonesia",
      startDate: "2025-08-14",
      endDate: "2025-08-21",
      budgetSpent: 1600,
      travelers: 2,
      status: "completed",
      imageUrl: "https://source.unsplash.com/featured/?bali,resort"
    },
    {
      id: "prev_dubai",
      destination: "Dubai",
      country: "United Arab Emirates",
      startDate: "2026-03-05",
      endDate: "2026-03-08",
      budgetSpent: 2100,
      travelers: 4,
      status: "completed",
      imageUrl: "https://source.unsplash.com/featured/?dubai,skyline"
    }
  ];

  res.status(200).json({
    success: true,
    data: trips
  });
};

module.exports = {
  getPreviousTrips
};

