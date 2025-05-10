const puppeteer = require("puppeteer");
const mongoose = require("mongoose");


const MONGO_URI = "mongodb+srv://medhadwivedi2003:pNFURpL2vPLQLvlJ@cluster0.7gbfuyy.mongodb.net/eventsdb";

const eventSchema = new mongoose.Schema({
  area: String,
  title: String,
  desc: String,
  startDate: String,
  endDate: String,
  rate: String,
});

const Event = mongoose.model("Event", eventSchema);

(async () => {
  await mongoose.connect(MONGO_URI);
  await Event.deleteMany(); // Optional: clear old data

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.sydney.com/events");

  const data = await page.evaluate(() => {
    const getText = (selector) =>
      [...document.querySelectorAll(selector)].map((el) => el.innerText);

    return {
      area: getText(".tile__area-name"),
      title: getText(".tile__product-list-tile-heading"),
      desc: getText("div.prod-desc"),
      startDate: getText(".start-date"),
      endDate: getText(".end-date"),
      rate: getText(".tile__product-rate-from"),
    };
  });

  const events = data.title.map((_, i) => ({
    area: data.area[i] || "",
    title: data.title[i] || "",
    desc: data.desc[i] || "",
    startDate: data.startDate[i] || "",
    endDate: data.endDate[i] || "",
    rate: data.rate[i] || "",
  }));

  await Event.insertMany(events);
  console.log("Events saved to MongoDB");
  await browser.close();
  mongoose.connection.close();
})();
