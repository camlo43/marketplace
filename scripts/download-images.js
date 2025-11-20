const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const products = [
    { id: 1, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Brembo_Brakes.jpg", filename: "brembo-brakes.jpg" },
    { id: 2, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Engine_oil_filter.JPG", filename: "bosch-oil-filter.jpg" },
    { id: 3, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Michelin_Pilot_Sport_Racing_Tire_on_Wheel.jpg", filename: "michelin-tire.jpg" },
    { id: 4, url: "https://commons.wikimedia.org/wiki/Special:FilePath/NGK-plugs.jpg", filename: "ngk-spark-plugs.jpg" },
    { id: 5, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Castrol_oil_cans.jpg", filename: "castrol-oil.jpg" },
    { id: 6, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Electric_bulbs_for_vehicles.jpg", filename: "philips-bulb.jpg" },
    { id: 7, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Car_Radio.jpg", filename: "pioneer-stereo.jpg" },
    { id: 8, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Engine_oil_filter.JPG", filename: "kn-air-filter.jpg" },
    { id: 9, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Absorb_Shock%C2%AE.JPG", filename: "monroe-shock.jpg" },
    { id: 10, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Car_Radio.jpg", filename: "garmin-dashcam.jpg" },
    { id: 11, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Michelin_Pilot_Sport_Racing_Tire_on_Wheel.jpg", filename: "weathertech-mats.jpg" },
    { id: 12, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Photo-CarBattery.jpg", filename: "optima-battery.jpg" },
    { id: 13, url: "https://commons.wikimedia.org/wiki/Special:FilePath/1960_Rambler_Custom_Cross_Country_-_red_and_white_station_wagon_with_luggage_in_Pennsylvania_5of5.jpg", filename: "thule-rack.jpg" },
    { id: 14, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Castrol_oil_cans.jpg", filename: "meguiars-wax.jpg" },
    { id: 15, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Brembo_Brakes.jpg", filename: "stoptech-lines.jpg" },
    { id: 16, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Engine_oil_filter.JPG", filename: "mobil1-filter.jpg" },
    { id: 17, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Electric_bulbs_for_vehicles.jpg", filename: "sylvania-bulbs.jpg" },
    { id: 18, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Castrol_oil_cans.jpg", filename: "chemical-guys-soap.jpg" },
    { id: 19, url: "https://commons.wikimedia.org/wiki/Special:FilePath/NGK-plugs.jpg", filename: "denso-sensor.jpg" },
    { id: 20, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Absorb_Shock%C2%AE.JPG", filename: "bilstein-shock.jpg" },
    { id: 21, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Car_Radio.jpg", filename: "kicker-sub.jpg" },
    { id: 22, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Michelin_Pilot_Sport_Racing_Tire_on_Wheel.jpg", filename: "rainx-wiper.jpg" },
    { id: 23, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Absorb_Shock%C2%AE.JPG", filename: "moog-ball-joint.jpg" },
    { id: 24, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Car_Radio.jpg", filename: "anker-transmitter.jpg" },
    { id: 25, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Michelin_Pilot_Sport_Racing_Tire_on_Wheel.jpg", filename: "covercraft-sunscreen.jpg" }
];

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const outputPath = path.join(__dirname, '../public/products', filename);
        // Use curl with -L to follow redirects and -o to output to file
        // Added User-Agent just in case, though curl usually works fine without it on Commons
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

async function downloadAll() {
    console.log('Starting downloads with curl...');
    // Create directory if it doesn't exist
    const dir = path.join(__dirname, '../public/products');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    for (const product of products) {
        try {
            await downloadImage(product.url, product.filename);
        } catch (e) {
            console.error(`Failed to download ${product.filename}`);
        }
    }
    console.log('All downloads complete.');
}

downloadAll();
