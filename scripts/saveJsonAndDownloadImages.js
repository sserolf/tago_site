/* eslint-disable no-console */
import fs from 'fs';
import axios from 'axios';
import { getAllIgPosts } from './igPosts.js';
const manualNews = JSON.parse(fs.readFileSync('./src/json/manualNews.json', 'utf-8'));
const allPosts = [];

// COMBINE IG POSTS AND MANUAL NEWS
getAllIgPosts.map((post) => {
  allPosts.push(post);
});

// FORMAT MANUAL NEWS DATES
manualNews.map((post) => {
  const day = post.timestamp.split('/')[0];
  const month = post.timestamp.split('/')[1];
  const year = post.timestamp.split('/')[2];
  post.timestamp = new Date(`${year}-${month}-${day}`).toString();
  allPosts.push(post);
});

// SORT TOTAL POSTS BY DATE
allPosts.sort((a, b) => {
  const oldDateA = a.timestamp;
  const oldDateB = b.timestamp;
  const newDateA = new Date(oldDateA);
  const newDateB = new Date(oldDateB);
  return newDateB - newDateA;
});

const saveJsonAndDownloadImages = () => {
  // Array of image URLs
  const imageUrls = [];
  allPosts.map((post) => {
    if (post.media_type === 'IMAGE') {
      imageUrls.push({ id: post.id, url: post.media_url });
      post.media_url = 'assets/images/compressed/' + post.id + '.webp';
    }
    if (post.media_type === 'CAROUSEL_ALBUM') {
      post.children.data.map((child) => {
        if (child.media_type === 'IMAGE') {
          imageUrls.push({ id: child.id, url: child.media_url });
          child.media_url = 'assets/images/compressed/' + child.id + '.webp';
        }
      });
    }
  });

  // Create the "to_compress" folder if it doesn't exist
  const jsonPath = 'public/json';
  if (!fs.existsSync(jsonPath)) {
    fs.mkdirSync(jsonPath);
  } else {
    fs.rm(jsonPath, { recursive: true, force: true }, (err) => {
      if (err) {
        throw err;
      }
      fs.mkdirSync(jsonPath);
      console.log(`${jsonPath} is deleted and recreated!`);
      // Create a script to write a file in public/json/igPosts.json with allPosts data
      const igPostsData = JSON.stringify(allPosts, null, 2);
      const filePath = 'public/json/igPosts.json';
      fs.writeFile(filePath, igPostsData, (err) => {
        if (err) throw err;
        console.log(`${filePath} created successfully!`);
      });
    });
  }

  // Create the "to_compress" folder if it doesn't exist
  const folderPath = 'to_compress/ig';
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  // Download images and save them in the "to_compress" folder function
  const downloadImage = async (url, filename) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    fs.writeFile(filename, response.data, (err) => {
      if (err) throw err;
      // console.log(`${filename} downloaded successfully!`);
    });
  };

  // Download images and save them in the "to_compress" folder
  imageUrls.map((post) => {
    const id = post.id;
    const url = post.url;
    const output = `${folderPath}/${id}.png`;
    downloadImage(url, output);
  });
};

saveJsonAndDownloadImages();
