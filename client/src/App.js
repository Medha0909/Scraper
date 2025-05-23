import React, { useEffect, useState } from "react";
import "./App.css";

const images = [
  { img: "https://assets.atdw-online.com.au/images/9e612a3d635dd644f4fc4f9e236caec2.jpeg?rect=400%2C0%2C2400%2C1800&w=2048&h=1536&rot=360" },
  { img: "https://assets.atdw-online.com.au/images/cf8b30a84375e1d0906e750ef615efcd.jpeg?rect=0%2C0%2C1600%2C1200&w=1600&h=1200&rot=360" },
  { img: "https://assets.atdw-online.com.au/images/2fad205db1d34374e7f0dac721782db5.jpeg?rect=111%2C0%2C1779%2C1334&w=1600&h=1200&rot=360" },
  { img: "https://assets.atdw-online.com.au/images/68c1959f860f6e23265bdf94f2afe2d2.jpeg?rect=252%2C0%2C3375%2C2531&w=2048&h=1536&rot=360" },
  { img: "https://assets.atdw-online.com.au/images/e22c2f67f2846310a24e4b1df34922e0.jpeg?rect=221%2C0%2C3557%2C2668&w=1600&h=1200&&rot=360" },
  { img: "https://assets.atdw-online.com.au/images/997367b1829c1faaca6cb1e5bc35fea9.jpeg?rect=195%2C0%2C3111%2C2333&w=1600&h=1200&&rot=360" },
  { img: "https://www.sydney.com/sites/sydney/files/styles/landscape_1200x675/public/2024-08/203836_Vivid_Sydney_2024_DNSW_DT.webp?h=f0fb51a5&itok=o2IECLOw" },
];

const App = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = [
    "Explore the extraordinary.",
    "Moments that matter.",
    "Discover Sydney, discover yourself.",
    "Every event tells a story.",
  ];

  useEffect(() => {
    const fetchEvents = () => {
      fetch("https://scraper-r2c4.onrender.com/api/events")
        .then((res) => res.json())
        .then((data) => {
          setEvents(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching events:", err);
          setLoading(false);
        });
    };

    fetchEvents(); // initial fetch
    const interval = setInterval(fetchEvents, 60000); // auto-refresh every 60s

    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(quoteInterval);
    };
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      (filter === "All" || event.area === filter) &&
      event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <header>
        <h1>Events</h1>
        <p className="quote">{quotes[quoteIndex]}</p>
        <div className="controls">
          <input
            type="text"
            placeholder="Search events..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <select onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Areas</option>
            <option value="Sydney City">Sydney City</option>
            <option value="Inner Sydney">Inner Sydney</option>
          </select>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </header>

      {loading ? (
        <p className="loading">Loading events...</p>
      ) : (
        <div className="grid">
          {filteredEvents.map((event, index) => (
            <div className="card" key={index}>
              <img src={images[index % images.length].img} alt={event.title} />
              <div className="content">
                <span className="date">
                  {event.startDate} – {event.endDate}
                </span>
                <h2>{event.title}</h2>
                <p>{event.desc}</p>
                <div className="info">
                  <span>{event.area}</span>
                  <span>{event.rate || "$0"}</span>
                </div>
                <button
                  onClick={() => {
                    const email = prompt("Enter your email to get tickets:");
                    if (email && /\S+@\S+\.\S+/.test(email)) {
                      // TODO: Send email to backend if needed
                      window.location.href = "https://www.sydney.com/events";
                    } else {
                      alert("Please enter a valid email address.");
                    }
                  }}
                  className="ticket-button"
                >
                  GET TICKETS
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
