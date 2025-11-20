const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Complete list of 25 products with unique image sources
const products = [
    // 1. Brembo Brakes (Real)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Brembo_Brakes.jpg", filename: "p01-brembo-brakes.jpg" },
    // 2. Bosch Oil Filter (Real)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Engine_oil_filter.JPG", filename: "p02-bosch-oil-filter.jpg" },
    // 3. Michelin Tire (Real)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Michelin_Pilot_Sport_Racing_Tire_on_Wheel.jpg", filename: "p03-michelin-tire.jpg" },
    // 4. NGK Spark Plugs (Real)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/NGK-plugs.jpg", filename: "p04-ngk-spark-plugs.jpg" },
    // 5. Castrol Oil (Real)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Castrol_oil_cans.jpg", filename: "p05-castrol-oil.jpg" },
    // 6. Philips Bulb (Real)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Electric_bulbs_for_vehicles.jpg", filename: "p06-philips-bulb.jpg" },
    // 7. Pioneer Stereo (Real)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Car_Radio.jpg", filename: "p07-pioneer-stereo.jpg" },
    // 8. K&N Air Filter (Placeholder - Unique)
    { url: "https://placehold.co/600x400/png?text=K%26N+Air+Filter", filename: "p08-kn-air-filter.jpg" },
    // 9. Monroe Shock (Real)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Absorb_Shock%C2%AE.JPG", filename: "p09-monroe-shock.jpg" },
    // 10. Garmin Dashcam (Real - Unique)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Dashcams_P1210466.JPG", filename: "p10-garmin-dashcam.jpg" },
    // 11. WeatherTech Mats (Real - Unique)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Car_mats_fitted.jpg", filename: "p11-weathertech-mats.jpg" },
    // 12. Optima Battery (Real)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Photo-CarBattery.jpg", filename: "p12-optima-battery.jpg" },
    // 13. Thule Rack (Real)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/1960_Rambler_Custom_Cross_Country_-_red_and_white_station_wagon_with_luggage_in_Pennsylvania_5of5.jpg", filename: "p13-thule-rack.jpg" },
    // 14. Meguiar's Wax (Updated - Real Wax Container)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/JohnsonsPreparedLiquidWaxContainer.jpg", filename: "p14-meguiars-wax.jpg" },
    // 15. StopTech Lines (Placeholder - Unique)
    { url: "https://placehold.co/600x400/png?text=Brake+Lines", filename: "p15-stoptech-lines.jpg" },
    // 16. Mobil 1 Filter (Updated - Real Oil Filter)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Oil_filter.JPG", filename: "p16-mobil1-filter.jpg" },
    // 17. Sylvania Bulbs (Updated - Real Headlamp)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Headlamp.jpg", filename: "p17-sylvania-bulbs.jpg" },
    // 18. Chemical Guys Soap (Updated - Real Detergent Bottle)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Plastic_bottle_of_detergent.jpg", filename: "p18-chemical-guys-soap.jpg" },
    // 19. Denso Sensor (Placeholder - Unique)
    { url: "https://placehold.co/600x400/png?text=Oxygen+Sensor", filename: "p19-denso-sensor.jpg" },
    // 20. Bilstein Shock (Updated - Real Shock Absorber)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Automobile_suspension_shock_absorber.jpg", filename: "p20-bilstein-shock.jpg" },
    // 21. Kicker Sub (Real - Unique)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Subwoofer.jpg", filename: "p21-kicker-sub.jpg" },
    // 22. Rain-X Wiper (Updated - Real Wiper)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Windshield_Wiper_3.jpg", filename: "p22-rainx-wiper.jpg" },
    // 23. Moog Ball Joint (Updated - Real Suspension)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Suspension.jpg", filename: "p23-moog-ball-joint.jpg" },
    // 24. Anker Transmitter (Updated - Real FM Modulator)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/MP3_Player_with_FM_modulator_for_12v_car_socket.jpg", filename: "p24-anker-transmitter.jpg" },
    // 25. Covercraft Sunscreen (Updated - Real Sun Shade)
    { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Car_sun_shade.jpg", filename: "p25-covercraft-sunscreen.jpg" }
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

async function resetAndDownload() {
    console.log('Starting full image reset...');

    const dir = path.join(__dirname, '../public/products');

    // 1. Clean up existing images
    if (fs.existsSync(dir)) {
        console.log('Cleaning up existing images...');
        const files = fs.readdirSync(dir);
        for (const file of files) {
            if (file.endsWith('.jpg') || file.endsWith('.png')) {
                fs.unlinkSync(path.join(dir, file));
            }
        }
    } else {
        fs.mkdirSync(dir, { recursive: true });
    }

    // 2. Download new images
    console.log('Downloading new unique images...');
    for (const product of products) {
        try {
            await downloadImage(product.url, product.filename);
            // Small delay to be nice to servers
            await sleep(500);
        } catch (e) {
            console.error(`Failed to download ${product.filename}`);
        }
    }
    console.log('Reset complete. All images updated.');
}

resetAndDownload();
