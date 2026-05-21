export const API_STATUS = [
  {
    id: "pokeapi",
    name: "PokéAPI",
    status: "operational",
    uptime: 99.98,
    incidents: [],
  },

  {
    id: "dummyjson",
    name: "DummyJSON",
    status: "degraded",
    uptime: 98.72,
    incidents: [
      {
        title: "High API latency",
        date: "May 20, 2026",
        resolution:
          "Issue resolved after infrastructure scaling.",
      },

      {
        title: "Intermittent timeout errors",
        date: "May 14, 2026",
        resolution:
          "Patched upstream networking issue.",
      },
    ],
  },
];