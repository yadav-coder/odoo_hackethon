const crypto = require("crypto");

// In-memory store for public/guest trips
let publicTrips = [];

const createTrip = (payload) => {
  const trip = {
    id: crypto.randomUUID(),
    ...payload,
    createdAt: new Date().toISOString(),
    status: "upcoming"
  };
  
  publicTrips.push(trip);
  return trip;
};

const listTrips = (options) => {
  let filteredTrips = [...publicTrips];

  if (options.q) {
    const query = options.q.toLowerCase();
    filteredTrips = filteredTrips.filter(t => 
      t.destination?.toLowerCase().includes(query) || 
      t.title?.toLowerCase().includes(query)
    );
  }

  if (options.status) {
    filteredTrips = filteredTrips.filter(t => t.status === options.status);
  }

  if (options.minBudget) {
    filteredTrips = filteredTrips.filter(t => t.budget >= Number(options.minBudget));
  }

  if (options.maxBudget) {
    filteredTrips = filteredTrips.filter(t => t.budget <= Number(options.maxBudget));
  }

  if (options.sortBy) {
    filteredTrips.sort((a, b) => {
      let aVal = a[options.sortBy];
      let bVal = b[options.sortBy];
      
      if (aVal < bVal) return options.sortDir === 'desc' ? 1 : -1;
      if (aVal > bVal) return options.sortDir === 'desc' ? -1 : 1;
      return 0;
    });
  } else {
    filteredTrips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const limit = options.limit ? parseInt(options.limit) : 10;
  const page = options.page ? parseInt(options.page) : 1;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedTrips = filteredTrips.slice(startIndex, endIndex);

  return {
    meta: {
      total: filteredTrips.length,
      page,
      limit,
      totalPages: Math.ceil(filteredTrips.length / limit)
    },
    data: paginatedTrips
  };
};

module.exports = {
  createTrip,
  listTrips
};
