#!/usr/bin/env python3
import re

# Read the file
with open('/Users/camilochaves/Documents/marketplace/src/data/mockProducts.js', 'r') as f:
    content = f.read()

# Mapping of product IDs to new image paths
image_updates = {
    31: "/products/p31-led-lights.png",
    32: "/products/p32-alpine-amp.png",
    33: "/products/p33-fram-filter.png",
    34: "/products/p34-eibach-springs.png",
    35: "/products/p35-bluedriver-scanner.png",
    36: "/products/p36-seat-covers.png",
    37: "/products/p37-alternator.png",
    38: "/products/p38-bike-rack.png",
    39: "/products/p39-turtle-wax.png",
    40: "/products/p40-brake-fluid.png",
    41: "/products/p41-fuel-filter.png",
    42: "/products/p42-led-bar.png",
    43: "/products/p43-wheel-cleaner.png",
    44: "/products/p44-ignition-coil.png",
    45: "/products/p45-air-suspension.png",
    46: "/products/p46-jbl-speakers.png",
    47: "/products/p47-window-deflectors.png",
    48: "/products/p48-control-arm.png",
    49: "/products/p49-usb-charger.png",
    50: "/products/p50-trunk-organizer.png",
}

# Update each product's image
for product_id, new_image in image_updates.items():
    # Find the product block and update its image
    pattern = rf'(id:\s*{product_id},[\s\S]*?image:\s*")[^"]*(")'
    replacement = rf'\1{new_image}\2'
    content = re.sub(pattern, replacement, content)
    print(f"✓ Updated product {product_id}")

# Write back
with open('/Users/camilochaves/Documents/marketplace/src/data/mockProducts.js', 'w') as f:
    f.write(content)

print("\n✅ All product images updated successfully!")
