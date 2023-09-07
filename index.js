import puppeteer from "puppeteer";

const getQuotes = async () => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  // On this new page:
  // - open the "http://quotes.toscrape.com/" website
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto(
    "https://argentinaestudia.com/mejores-universidades-de-argentina/",
    {
      waitUntil: "domcontentloaded",
    }
  )
  // Get page data
  const quotes = await page.evaluate(() => {
    // Fetch the first element with class "quote"
    // Get the displayed text and returns it
    const quoteList = document.querySelector("tbody").querySelectorAll("tr");

    var ranking = 0;


    return Array.from(quoteList)
      .filter(
        (quote) =>
          quote.querySelectorAll("td")[3].innerHTML.trim() == "Buenos Aires"
      )
      .map((quote) => {
        var posicion = 0;
        var nombreUniversidad = "";
        var siglas = "";
        var ciudad = "";
        var tdList = quote.querySelectorAll("td");
        tdList.forEach((td) => {
          posicion++;
          switch (posicion) {
            case 1:
              ranking++;
              break;
            case 2:
              var guionIndice = td.querySelector("a").innerHTML.indexOf("–");

              if (guionIndice == -1) {
                nombreUniversidad = td.querySelector("a").innerHTML;
                break;
              }

              nombreUniversidad = td
                .querySelector("a")
                .innerHTML.substring(guionIndice + 2);
              break;
            case 3:
              siglas = td.innerHTML;
              break;
            case 4:
              ciudad = td.innerHTML;
              break;
          }
        });
        return { ranking, nombreUniversidad, siglas, ciudad };
      });
  });

  // Display the quotes
  console.log(quotes);
};
// Start the scraping
getQuotes();
