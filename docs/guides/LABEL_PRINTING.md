# Label Printing Guide

## Overview

The Datacenter Inventory Management System system includes comprehensive label
printing functionality optimized for the **Brother PT-E550W** label printer.
You can print professional labels with QR codes for assets and storage
containers, making physical identification and tracking simple and efficient.

## Features

  * **Print labels for any asset** (servers, switches, cables, cards, NICs, DPUs, transceivers, etc.)
  * **Print labels for storage containers** (boxes, bins, shelves, cabinets, etc.)
  * **Brother PT-E550W optimization** with support for standard tape widths
  * **QR code integration** \- each label includes a scannable QR code
  * **Browser-based printing** \- works immediately without additional setup
  * **Optional direct printer support** \- send jobs directly to network printers
  * **Professional label design** \- compact, readable format optimized for label tape

## Where to Print Labels

### 1\. Assets Table (All Asset Types)

**Location:** Assets page → Any row in the table

  1. Navigate to the **Assets** page
  2. Find the asset you want to label
  3. Click the **🏷️ Label** button in the Actions column
  4. Label preview modal opens

**Available for:** All asset types including cables, cards, servers, switches,
NICs, DPUs, transceivers, and more.

### 2\. Asset Detail Page

**Location:** Individual asset detail page → Header

  1. Navigate to any asset detail page
  2. Click **🏷️ Print Label** button in the page header
  3. Label preview modal opens

### 3\. Storage Containers Table

**Location:** Storage Containers page → Any row in the table

  1. Navigate to the **Storage Containers** page
  2. Find the container you want to label
  3. Click the **🏷️ Label** button in the Actions column
  4. Label preview modal opens

**Available for:** All storage container types (box, bin, shelf, cabinet,
drawer, rack, pallet).

## Label Sizes

The Brother PT-E550W supports two tape widths. Our label templates are
optimized for:

### 12mm (0.47") Tape

  * **Label Dimensions:** Variable length × 12mm
  * **QR Code Size:** 10mm × 10mm
  * **Font Sizes:** 4-5pt
  * **Best For:** Small items, compact labels, cables, cards

### 24mm (0.94") Tape

  * **Label Dimensions:** Variable length × 24mm
  * **QR Code Size:** 18mm × 18mm
  * **Font Sizes:** 6-7pt
  * **Best For:** Standard labels, servers, switches, storage containers

**Note:** The PT-E550W supports 12mm and 24mm tape only. 36mm tape is not
supported by this model.

## Label Contents

### Asset Labels Include:

  * **QR Code** with asset data (ID, asset tag, serial number, type, manufacturer, model)
  * **Asset Tag** (bold, prominent)
  * **Manufacturer & Model**
  * **Serial Number**
  * **Hostname** (if available)

### Storage Container Labels Include:

  * **QR Code** with container data (ID, name, type, barcode, location)
  * **Container Name** (bold, prominent)
  * **Container Type** (box, bin, shelf, etc.)
  * **Barcode** (if set)
  * **Location** (if set)

## How to Print Labels

### Method 1: Print via Browser (Recommended)

This method works immediately without any setup and is compatible with all
printers.

  1. Click the **🏷️ Label** or **🏷️ Print Label** button
  2. Review the label preview
  3. Select your tape size:

\- ☑️ **12mm (0.47")** \- ☑️ **24mm (0.94")**

  1. Click **Print via Browser**
  2. In the print dialog:

\- Select your **Brother PT-E550W** printer - Ensure paper size matches tape
width - Print!

### Method 2: Send to Printer Directly (Optional)

For network-connected Brother PT-E550W printers, you can configure direct
printing.

**Setup:**

  1. Ensure your Brother PT-E550W is connected to your network
  2. Find your printer's IP address:

\- On printer LCD: Menu → Network → IP Address

  1. In the label print dialog:

\- Expand **"Direct Printer Setup (Optional)"** \- Enter printer IP address
(e.g., `192.168.1.100`) - IP is saved in your browser for future use

  1. Click **Send to Printer Directly**

**Note:** Direct printing requires additional Brother SDK integration on the
backend server. The browser printing method is recommended for most users.

## Brother PT-E550W Setup

### Printer Configuration

  1. **Install Tape:**

\- Use Brother TZe laminated tape cassettes - Recommended widths: 12mm or 24mm
- Supports various colors (white on black, black on white, etc.)

  1. **Connect to Network (for direct printing):**

\- Menu → Network → Wireless LAN → Setup - Follow on-screen instructions to
connect to WiFi - Note the assigned IP address

  1. **USB Connection (alternative):**

\- Connect printer to computer via USB - Install Brother P-touch Editor
drivers - Use browser printing method

### Recommended Settings

  * **Print Quality:** Best
  * **Tape Width:** Match your installed tape (12mm or 24mm)
  * **Auto Cut:** ON (for individual labels)
  * **Chain Print:** OFF (for individual labels)

## QR Code Scanning

Each label includes a QR code that can be scanned to quickly identify and
locate items in the system.

### What's in the QR Code?

**Asset QR Codes contain:**

    
    
    {
      "id": 123,
      "asset_tag": "SRV-001",
      "serial_number": "ABC123XYZ",
      "asset_type": "server",
      "manufacturer": "Dell",
      "model": "PowerEdge R740"
    }
    

**Container QR Codes contain:**

    
    
    {
      "type": "container",
      "id": 45,
      "name": "Box A-12",
      "container_type": "box",
      "barcode": "BOX-A-12",
      "location": "Aisle 3, Bay 5"
    }
    

### Scanning Labels

Use the built-in barcode scanner feature:

  1. Go to **Assets** page
  2. Click the **📷 Scan** button
  3. Point camera at QR code
  4. System automatically identifies and opens the item

## Label Design Specifications

### Layout

    
    
    ┌─────────────────────────────────────┐
    │  ┌────┐                             │
    │  │ QR │  Asset Tag / Container Name │
    │  │Code│  Manufacturer & Model       │
    │  └────┘  Serial Number / Details    │
    └─────────────────────────────────────┘
    

### Design Features

  * **High contrast** black text on white background
  * **Monospace font** for serial numbers and barcodes
  * **Text overflow handling** with ellipsis
  * **Optimized spacing** for label printer output
  * **Print-friendly** CSS with proper margins

## Troubleshooting

### Label Not Printing

**Problem:** Nothing happens when clicking "Print via Browser"

**Solution:**

  * Check that printer is powered on and connected
  * Verify correct printer is selected in print dialog
  * Try printing a test page from printer settings
  * Ensure browser has printer access permissions

### QR Code Not Scanning

**Problem:** QR code on label won't scan

**Solution:**

  * Ensure adequate lighting
  * Hold camera 6-12 inches from label
  * Try different angles
  * Clean camera lens
  * Verify printer quality settings are set to "Best"

### Label Size Incorrect

**Problem:** Label prints too large or too small

**Solution:**

  * In print dialog, set page size to match tape width
  * For 12mm tape: Select "12mm" or "0.47 inch"
  * For 24mm tape: Select "24mm" or "0.94 inch"
  * Disable "Fit to page" or "Scale to fit" options

### Text Cut Off on Label

**Problem:** Text is truncated or missing

**Solution:**

  * Text automatically truncates if too long
  * Use shorter asset tags or names
  * Try larger tape size (24mm vs 12mm)
  * Verify printer margins are set to minimum

### Direct Printing Not Working

**Problem:** "Send to Printer Directly" fails

**Solution:**

  * Verify printer IP address is correct
  * Ensure printer is on same network as server
  * Check firewall settings (allow port 9100)
  * Use "Print via Browser" as alternative
  * Consider installing Brother P-touch SDK on print server

## Best Practices

### Labeling Strategy

  1. **Print labels in batches** for new equipment
  2. **Apply labels to visible locations** :

\- Servers: Front bezel or top - Switches: Front panel or side - Cables: Both
ends (use smaller 24mm tape) - Storage boxes: Multiple sides for visibility

  1. **Use protective label covers** for high-wear areas
  2. **Keep backup labels** for critical assets
  3. **Update labels** when asset information changes

### Label Placement

**Servers:**

  * Front bezel (primary)
  * Top cover (secondary)
  * Avoid blocking ventilation

**Switches:**

  * Front panel above ports
  * Side panel if front is crowded

**Cables:**

  * Both connectors (use small labels)
  * Cable management tags

**Storage Containers:**

  * Front panel (primary)
  * Side panels (for shelf visibility)
  * Top (for stacked containers)

### Tape Selection

  * **White on Black:** High visibility, professional
  * **Black on White:** Standard, good for most uses
  * **Black on Clear:** Discrete, blends with surfaces
  * **Fluorescent:** High-visibility for critical items

## Advanced Features

### Custom Label Data

QR codes can be scanned by external apps and systems. The JSON data format is
standard and can be parsed by:

  * Mobile barcode scanner apps
  * Asset tracking systems
  * Inventory management software
  * Custom integration scripts

### API Integration

Labels can be generated programmatically via API:

**Generate QR Code for Asset:**

    
    
    GET /api/v1/barcodes/generate/{asset_id}
    

**Generate QR Code for Container:**

    
    
    GET /api/v1/barcodes/generate-container/{container_id}
    

**Print Label (Direct):**

    
    
    POST /api/v1/barcodes/print-label/{asset_id}
    POST /api/v1/barcodes/print-container-label/{container_id}
    
    Body: {
      "label_size": "24mm",
      "printer_ip": "192.168.1.100"
    }
    

## Accessibility

  * **No login required** \- Anyone can print labels
  * **Keyboard navigation** \- All buttons accessible via keyboard
  * **Screen reader compatible** \- Proper ARIA labels
  * **Color blind friendly** \- High contrast, not reliant on color

## Support

For additional help:

  * Check printer status on Brother PT-E550W LCD
  * Review Brother P-touch Editor documentation
  * Verify tape cassette is installed correctly
  * Test with simple text label before printing QR codes

## Technical Details

### Printer Specifications

  * **Model:** Brother PT-E550W
  * **Type:** Label printer with thermal transfer
  * **Connectivity:** USB, WiFi, Ethernet (via adapter)
  * **Tape Types:** TZe laminated tape (12mm and 24mm supported)
  * **Resolution:** 180 dpi
  * **Max Print Speed:** 30mm/sec

### Supported Brother Printers

The system uses the `labelprinterkit` library which supports multiple Brother
P-Touch printer models:

  * **PT-E500** \- Entry-level model
  * **PT-E550W** \- Current model (supports 12mm and 24mm tape)
  * **PT-H500** \- High-end model
  * **PT-P700** \- Professional model
  * **PT-P750W** \- Professional wireless model

**Note:** The current implementation is configured for PT-E550W. To use other
models, the printer class in `brother_printer.py` would need to be updated to
use the appropriate printer class (E500, H500, P700, or P750W) from
`labelprinterkit.printers`.

### Supported Browsers

  * Chrome/Edge (recommended)
  * Firefox
  * Safari
  * Any modern browser with print support

### Requirements

  * Brother PT-E550W label printer
  * TZe tape cassettes (12mm or 24mm)
  * Web browser with printer access
  * Network connection (for direct printing)

* * *

**Last Updated:** 2025-01-17 **Version:** 1.0 **Compatible with:** Datacenter
Inventory Management System v1.0+


