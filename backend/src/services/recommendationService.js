const getDestinationRecommendations = async ({ destination, budget }) => {
  const estimatedBudget = Number(budget) || 0;

  return [
    {
      title: `Explore ${destination}`,
      type: "activity",
      estimatedCost: Math.round(estimatedBudget * 0.15)
    },
    {
      title: "Local food experience",
      type: "food",
      estimatedCost: Math.round(estimatedBudget * 0.1)
    },
    {
      title: "Transport buffer",
      type: "transport",
      estimatedCost: Math.round(estimatedBudget * 0.12)
    }
  ];
};

module.exports = {
  getDestinationRecommendations
};

