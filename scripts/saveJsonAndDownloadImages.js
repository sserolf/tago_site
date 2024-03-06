/* eslint-disable no-console */
import fs from 'fs';
import axios from 'axios';

const access_token = process.argv[2].split('access_token=')[1];

import { getAllIgPostsData } from './igPosts.js';

const saveJsonAndDownloadImages = async () => {
  const allIgPosts = await getAllIgPostsData(access_token, '', false);

  const manualNews = JSON.parse(fs.readFileSync('./src/json/manualNews.json', 'utf-8'));
  const allPosts = [...allIgPosts, ...manualNews];

  allPosts.forEach((post) => {
    if (!post.id) {
      const [day, month, year] = post.timestamp.split('/');
      post.timestamp = new Date(`${year}-${month}-${day}`).toString();
    } else {
      post.timestamp = new Date(post.timestamp).toString();
    }
  });

  allPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const imageUrls = [];

  allPosts.forEach((post) => {
    if (post.media_type === 'IMAGE') {
      imageUrls.push({ id: post.id, url: post.media_url });
      post.media_url = `assets/images/compressed/${post.id}.webp`;
    }
    if (post.media_type === 'CAROUSEL_ALBUM') {
      post.children.data.forEach((child) => {
        if (child.media_type === 'IMAGE') {
          imageUrls.push({ id: child.id, url: child.media_url });
          child.media_url = `assets/images/compressed/${child.id}.webp`;
        }
      });
    }
  });

  const jsonPath = 'public/json';
  if (!fs.existsSync(jsonPath)) {
    fs.mkdirSync(jsonPath);
  } else {
    fs.rmSync(jsonPath, { recursive: true, force: true });
    fs.mkdirSync(jsonPath);
    console.log(`${jsonPath} is deleted and recreated!`);
  }

  const igPostsData = JSON.stringify(allPosts, null, 2);
  const filePath = 'public/json/igPosts.json';
  fs.writeFileSync(filePath, igPostsData);
  console.log(`${filePath} created successfully!`);

  const folderPath = 'to_compress/ig';
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  const downloadImage = async (url, filename) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    fs.writeFile(filename, response.data, (err) => {
      if (err) throw err;
      console.log(`${filename} downloaded successfully!`);
    });
  };

  imageUrls.forEach((post) => {
    const { id, url } = post;
    const output = `${folderPath}/${id}.png`;
    downloadImage(url, output);
  });
};

saveJsonAndDownloadImages();
