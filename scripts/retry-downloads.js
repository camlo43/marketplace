const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const products = [
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Car_Radio.jpg", filename: "anker-transmitter.jpg" },
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Shock_Absorbers_Detail.jpg", filename: "bilstein-shock.jpg" }, // Changed URL
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Castrol_oil_cans.jpg", filename: "chemical-guys-soap.jpg" },
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Michelin_Pilot_Sport_Racing_Tire_on_Wheel.jpg", filename: "covercraft-sunscreen.jpg" },
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/NGK-plugs.jpg", filename: "denso-sensor.jpg" },
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Car_Radio.jpg", filename: "kicker-sub.jpg" },
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Engine_oil_filter.JPG", filename: "mobil1-filter.jpg" },
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Shock_Absorbers_Detail.jpg", filename: "monroe-shock.jpg" }, // Changed URL
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Shock_Absorbers_Detail.jpg", filename: "moog-ball-joint.jpg" }, // Changed URL
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Michelin_Pilot_Sport_Racing_Tire_on_Wheel.jpg", filename: "rainx-wiper.jpg" },
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Brembo_Brakes.jpg", filename: "stoptech-lines.jpg" },
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Electric_bulbs_for_vehicles.jpg", filename: "sylvania-bulbs.jpg" }
];

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const outputPath = path.join(__dirname, '../public/products', filename);
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
    console.log('Starting retry downloads...');
    for (const product of products) {
        try {
            await downloadImage(product.url, product.filename);
            await sleep(1000); // 1 second delay
        } catch (e) {
            console.error(`Failed to download ${product.filename}`);
        }
    }
    console.log('Retry downloads complete.');
}

downloadAll();
