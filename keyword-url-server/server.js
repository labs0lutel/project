const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const keywordToUrls = {
  'weather': [`http://api.weatherapi.com/v1/current.xml?key=&q=London&aqi=yes`],
  'finance': ['https://api.coindesk.com/v1/bpi/currentprice.json'],
  'health': ['https://www.who.int/news-room/fact-sheets/detail/healthy-diet'],
  'science': ['https://www.sciencenews.org/feed'],
  'music': ['https://rss.itunes.apple.com/api/v1/us/apple-music/hot-tracks/all/10/explicit.json'],
  'technology': ['https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml'],
  'history': ['https://historyapi.com/v1/articles'],
  'travel': ['https://rss.nytimes.com/services/xml/rss/nyt/Travel.xml']
};

// Функция для сокращения URL с использованием TinyURL API
const shortenUrl = async (url) => {
  try {
    const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    return response.data;
  } catch (error) {
    console.error('Error shortening URL:', error);
    return url;  // Возвращаем оригинальный URL в случае ошибки
  }
};

app.get('/urls/:keyword', async (req, res) => {
  const keyword = req.params.keyword;
  const urls = keywordToUrls[keyword];
  if (urls) {
    try {
      // Сокращаем все URL для данного ключевого слова
      const shortenedUrls = await Promise.all(urls.map(url => shortenUrl(url)));
      res.json(shortenedUrls);
    } catch (error) {
      res.status(500).send('Error shortening URLs');
    }
  } else {
    res.status(404).send('Keyword not found');
  }
});

app.get('/download', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    const response = await axios.get(url, {
      responseType: 'text'
    });
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error downloading content');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});