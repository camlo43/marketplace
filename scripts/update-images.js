const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// List of products that had duplicated images and need unique ones
const products = [
    { url: "https://placehold.co/600x400/png?text=K%26N+Air+Filter", filename: "kn-air-filter.jpg" },
    { url: "https://placehold.co/600x400/png?text=Car+Wash+Soap", filename: "chemical-guys-soap.jpg" },
    { url: "https://placehold.co/600x400/png?text=Oxygen+Sensor", filename: "denso-sensor.jpg" },
    { url: "https://placehold.co/600x400/png?text=Bilstein+Shock", filename: "bilstein-shock.jpg" },
    { url: "https://placehold.co/600x400/png?text=Mobil+1+Oil+Filter", filename: "mobil1-filter.jpg" },
    { url: "https://placehold.co/600x400/png?text=Brake+Lines", filename: "stoptech-lines.jpg" },
    { url: "https://placehold.co/600x400/png?text=Wiper+Blades", filename: "rainx-wiper.jpg" }
];

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const outputPath = path.join(__dirname, '../public/products', filename);
        // Use curl with -L to follow redirects and -o to output to file
        const command = `curl -L -A "Mozilla/5.0" -o "${outputPath}" "${url}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error downloading ${filename}: ${error.message}`);
                reject(error);
                return;
            }
            console.log(`Downloaded ${filename}`);
            resolve();
        });
    });
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function downloadAll() {
    console.log('Starting update of duplicated images...');
    for (const product of products) {
        try {
            await downloadImage(product.url, product.filename);
            // 2 second delay to be nice to Wikimedia and avoid 429s
            await sleep(2000);
        } catch (e) {
            console.error(`Failed to download ${product.filename}`);
        }
    }
    console.log('Update complete.');
}

downloadAll();
