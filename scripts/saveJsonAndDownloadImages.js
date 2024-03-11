/* eslint-disable no-console */
import fs from 'fs';
import axios from 'axios';
import sizeOf from 'image-size';

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

  const folderPath = 'to_compress/ig';
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  const downloadImage = async (url, filename) => {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      fs.writeFileSync(filename, response.data);
      console.log(`${filename} downloaded successfully!`);
    } catch (err) {
      console.error(err);
    }
  };

  const saveJson = () => {
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
    fs.copyFileSync('src/json/gigs.json', 'public/json/gigs.json');
    console.log('gigs.json copied successfully!');
  };

  const changeMediaUrlPathAndAddAspectRatio = async () => {
    for (let i = 0; i < allPosts.length; i++) {
      const post = allPosts[i];
      if (post.media_type === 'IMAGE') {
        await downloadImage(post.media_url, `${folderPath}/${post.id}.png`);
        const dimensions = sizeOf(`${folderPath}/${post.id}.png`);
        post.aspect_ratio = `${dimensions.width} / ${dimensions.height}`;
        post.media_url = `assets/images/compressed/${post.id}.webp`;
      }
      if (post.media_type === 'CAROUSEL_ALBUM') {
        for (const child of post.children.data) {
          if (child.media_type === 'IMAGE') {
            await downloadImage(child.media_url, `${folderPath}/${child.id}.png`);
            const dimensions = sizeOf(`${folderPath}/${child.id}.png`);
            child.aspect_ratio = `${dimensions.width} / ${dimensions.height}`;
            child.media_url = `assets/images/compressed/${child.id}.webp`;
          }
        }
      }
      if (i === allPosts.length - 1) {
        saveJson();
      }
    }
  };

  changeMediaUrlPathAndAddAspectRatio();
};

saveJsonAndDownloadImages();
