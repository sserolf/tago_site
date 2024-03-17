import fs from 'node:fs';
import axios from 'axios';
import sharp from 'sharp';

import type { Post } from 'src/types/posts';

export const getAllIgPostsData = async (newUrl: string) => {
  const access_token: string = import.meta.env.IG_ACCESS_TOKEN as string;
  const url =
    // eslint-disable-next-line max-len
    'https://graph.facebook.com/v17.0/17841460325620436?fields=business_discovery.username(tagomagoband)%7Bmedia%7Bcaption%2Ctimestamp%2Cpermalink%2Cmedia_type%2Cmedia_url%2Cchildren%7Bmedia_url%2Cmedia_type%7D%7D%7D&access_token=' +
    access_token;
  const mediaData: Post[] = [];
  newUrl = newUrl !== '' ? newUrl : url;
  const response = await fetch(newUrl, {
    method: 'GET',
  });
  const data = await response.json();
  if (!data.error) {
    data.business_discovery.media.data.map((media: Post) => {
      mediaData.push(media);
    });
    // return mediaData as MediaDatum[];
    if (data.business_discovery.media.paging.cursors.after) {
      newUrl =
        // eslint-disable-next-line max-len
        'https://graph.facebook.com/v17.0/17841460325620436?fields=business_discovery.username(tagomagoband){media.after(' +
        data.business_discovery.media.paging.cursors.after +
        // eslint-disable-next-line max-len
        '){caption,timestamp,permalink,media_type,media_url,children{media_url,media_type}}}&access_token=' +
        access_token;
      const moreData = await getAllIgPostsData(newUrl);
      mediaData.push(...moreData);
      return mediaData;
    } else {
      return mediaData;
    }
  }
  return [];
};

export const getAllIgPostsImages = async (newUrl: string) => {
  const access_token: string = import.meta.env.IG_ACCESS_TOKEN as string;
  const url =
    // eslint-disable-next-line max-len
    'https://graph.facebook.com/v17.0/17841460325620436?fields=business_discovery.username(tagomagoband){media{media_type,media_url,children{media_url,media_type}}}&access_token=' +
    access_token;
  const mediaData: Post[] = [];
  newUrl = newUrl !== '' ? newUrl : url;
  const response = await fetch(newUrl, {
    method: 'GET',
  });
  const data = await response.json();
  if (!data.error) {
    data.business_discovery.media.data.map((media: Post) => {
      mediaData.push(media);
    });
    // return mediaData as MediaDatum[];
    if (data.business_discovery.media.paging.cursors.after) {
      newUrl =
        // eslint-disable-next-line max-len
        'https://graph.facebook.com/v17.0/17841460325620436?fields=business_discovery.username(tagomagoband){media.after(' +
        data.business_discovery.media.paging.cursors.after +
        // eslint-disable-next-line max-len
        '){media_type,media_url,children{media_url,media_type}}}&access_token=' +
        access_token;
      const moreData = await getAllIgPostsData(newUrl);
      mediaData.push(...moreData);
      return mediaData;
    } else {
      return mediaData;
    }
  }
  return [];
};

export const downloadIgImages = async (images: Post[]) => {
  const toCompressIgPath = 'to_compress/ig';
  if (!fs.existsSync(toCompressIgPath)) {
    fs.mkdirSync(toCompressIgPath);
  }
  let transform = true;
  const promises = images.map(async (post) => {
    if (post.id && post.media_type === 'IMAGE' && post.media_url) {
      try {
        const response = await axios.get(post.media_url, { responseType: 'arraybuffer' });
        fs.writeFileSync(`${toCompressIgPath}/${post.id}.png`, response.data);
        // eslint-disable-next-line no-console
        console.log(`${post.id} downloaded successfully!`);
      } catch (error) {
        transform = false;
      }
    } else if (post.id && post.media_type === 'CAROUSEL_ALBUM' && post.children) {
      const childPromises = post.children.data.map(async (child) => {
        try {
          const response = await axios.get(child.media_url, { responseType: 'arraybuffer' });
          fs.writeFileSync(`${toCompressIgPath}/${child.id}.png`, response.data);
          // eslint-disable-next-line no-console
          console.log(`${child.id} downloaded successfully!`);
        } catch (error) {
          transform = false;
        }
      });
      await Promise.all(childPromises);
    }
  });
  await Promise.all(promises);
  return transform;
};

export const transformImages = async (inputDir: string, removeFolder: boolean) => {
  const toCompressPath = 'to_compress';
  // Input and output directories
  const inputDirDefault = inputDir !== '' ? inputDir : toCompressPath;
  const outputDir = 'public/assets/images/compressed';

  const transform = async () => {
    // Get all files in the input directory
    const files = fs.readdirSync(inputDirDefault);

    // Filter files by supported image formats
    const supportedFormats = ['png', 'jpeg', 'jpg', 'gif'];
    const imageFiles = files.filter((file) =>
      supportedFormats.includes(file.split('.')[file.split('.').length - 1].toLowerCase()),
    );

    const transformedImages: string[] = [];

    // Process each image file
    imageFiles.forEach((file) => {
      const fileName = file.split('.')[0];
      const extension = file.split('.')[file.split('.').length - 1];
      const inputPath = `${inputDirDefault}/${file}`;
      const outputPath = `${outputDir}/${fileName}.webp`;

      // Resize and convert image to webp format
      if (fileName === 'logo2') {
        sharp(inputPath)
          .resize(102, null) // Resize to 102px width, height will adapt
          .toFormat('webp')
          .toFile(outputPath, (err) => {
            if (err) {
              console.error(`Error processing ${file}:`, err);
            } else {
              // eslint-disable-next-line no-console
              console.log(`Successfully transformed ${file} to webp`);
            }
          });
      } else if (fileName === 'fatmusik') {
        sharp(inputPath, { animated: true })
          .resize(75, null) // Resize to 50px width, height will adapt
          .toFormat('webp')
          .toFile(outputPath, (err) => {
            if (err) {
              console.error(`Error processing ${file}:`, err);
            } else {
              // eslint-disable-next-line no-console
              console.log(`Successfully transformed animated ${file} to webp`);
            }
          });
      } else if (fileName === 'menu2') {
        sharp(inputPath, { animated: true })
          .resize(96, null) // Resize to 96px width, height will adapt
          .toFormat('webp')
          .toFile(outputPath, (err) => {
            if (err) {
              console.error(`Error processing ${file}:`, err);
            } else {
              // eslint-disable-next-line no-console
              console.log(`Successfully transformed animated ${file} to webp`);
            }
          });
      } else if (extension === 'gif' && fileName !== 'fatmusik' && fileName !== 'menu2') {
        sharp(inputPath, { animated: true })
          .resize(105, null) // Resize to 105px width, height will adapt
          .toFormat('webp')
          .toFile(outputPath, (err) => {
            if (err) {
              console.error(`Error processing ${file}:`, err);
            } else {
              // eslint-disable-next-line no-console
              console.log(`Successfully transformed animated ${file} to webp`);
            }
          });
      } else {
        sharp(inputPath)
          .resize(500, null) // Resize to 500px width, height will adapt
          .toFormat('webp')
          .toFile(outputPath, (err) => {
            if (err) {
              console.error(`Error processing ${file}:`, err);
            } else {
              // eslint-disable-next-line no-console
              console.log(`Successfully transformed ${file} to webp`);
            }
          });
      }
      transformedImages.push(fileName);
    });
    return transformedImages;
  };

  // Get all files in the output directory and delete them
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  } else {
    if (removeFolder) {
      fs.rmSync(outputDir, { recursive: true, force: true });
      fs.mkdirSync(outputDir);
      // eslint-disable-next-line no-console
      console.log(`${outputDir} is deleted and recreated!`);
    }
  }

  return await transform();
};
