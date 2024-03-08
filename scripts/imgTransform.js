/* eslint-disable no-console */
import fs from 'fs';
import sharp from 'sharp';

const transformImages = (inputDir, removeFolder) => {
  // Input and output directories
  const inputDirDefault = inputDir !== '' ? inputDir : 'to_compress';
  const outputDir = 'public/assets/images/compressed';

  const transform = () => {
    // Get all files in the input directory
    fs.readdir(inputDirDefault, (err, files) => {
      if (err) {
        console.error('Error reading input directory:', err);
        return;
      }

      // Filter files by supported image formats
      const supportedFormats = ['png', 'jpeg', 'jpg', 'gif'];
      const imageFiles = files.filter((file) =>
        supportedFormats.includes(file.split('.')[file.split('.').length - 1].toLowerCase()),
      );

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
            .toFile(outputPath, (err, info) => {
              if (err) {
                console.error(`Error processing ${file}:`, err);
                console.error('Error info:', info);
              } else {
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
                console.log(`Successfully transformed animated ${file} to webp`);
              }
            });
        } else {
          sharp(inputPath)
            .resize(500, null) // Resize to 500px width, height will adapt
            .toFormat('webp')
            .toFile(outputPath, (err, info) => {
              if (err) {
                console.error(`Error processing ${file}:`, err);
                console.error('Error info:', info);
              } else {
                console.log(`Successfully transformed ${file} to webp`);
              }
            });
        }
      });
    });
  };

  // Get all files in the output directory and delete them
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  } else {
    if (removeFolder) {
      fs.rmSync(outputDir, { recursive: true, force: true });
      fs.mkdirSync(outputDir);
    }
    console.log(`${outputDir} is deleted and recreated!`);
  }
  transform();
};

transformImages('', true);
transformImages('to_compress/ig', false);
