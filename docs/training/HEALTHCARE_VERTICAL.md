# Healthcare Vertical Guide

## RackPlane for Healthcare & Medical Supply Management

This guide covers how to configure and use RackPlane for healthcare facilities, clinics, and medical supply management.

---

## Table of Contents

1. [Overview](#overview)
2. [Healthcare vs Datacenter](#healthcare-vs-datacenter)
3. [Setting Up Healthcare Vertical](#setting-up-healthcare-vertical)
4. [Healthcare Terminology](#healthcare-terminology)
5. [Healthcare-Specific Features](#healthcare-specific-features)
6. [Expiration Tracking](#expiration-tracking)
7. [Lot/Batch Number Tracking](#lotbatch-number-tracking)
8. [Par Level Alerts](#par-level-alerts)
9. [Compliance Considerations](#compliance-considerations)
10. [Use Cases](#use-cases)

---

## Overview

RackPlane's **Healthcare Vertical Pack** transforms the platform from datacenter asset management to medical supply and device management. This makes it ideal for:

- **Hospitals & Medical Centers** - Track medical devices and supplies
- **Clinics & Practices** - Manage medical equipment inventory
- **Medical Supply Companies** - Distribution and inventory management
- **Research Facilities** - Laboratory equipment and consumables
- **Pharmacies** - Medication inventory with expiration tracking

### Key Healthcare Features

| Feature | Description |
|---------|-------------|
| **Expiration Tracking** | Track expiration dates with automated alerts |
| **Lot/Batch Numbers** | Full traceability for recalls |
| **FEFO Ordering** | First Expired, First Out picking suggestions |
| **Par Level Alerts** | Automatic reorder point notifications |
| **Sterilization Tracking** | Track sterilization dates and cycles |
| **Healthcare Terminology** | Medical supply-focused language throughout |

---

## Healthcare vs Datacenter

### Terminology Comparison

| Concept | Datacenter | Healthcare |
|---------|------------|------------|
| Primary items | Assets | Supplies |
| Primary items (plural) | Assets | Supplies |
| Main location | Datacenter | Facility |
| Main locations (plural) | Datacenters | Facilities |
| Storage unit | Rack | Cabinet |
| Storage units | Racks | Cabinets |
| Deploy action | Deploy | Dispense |
| Return action | Return | Restock |
| Category | Asset Type | Supply Category |
| Status | Status | Supply Status |
| Storage area | Storage | Supply Room |
| Position | U-Space | Shelf |

### UI Differences

**Datacenter View:**
```
Dashboard > Datacenters > Primary DC > Racks > A01 > Assets
Button: "Deploy to Rack"
```

**Healthcare View:**
```
Dashboard > Facilities > Main Hospital > Cabinets > A01 > Supplies
Button: "Dispense from Cabinet"
```

### Feature Differences

| Feature | Datacenter | Healthcare |
|---------|------------|------------|
| Power Efficiency Advisor | ✅ Enabled | ❌ Hidden |
| Rack Visualization | ✅ Full U-slot view | ⚡ Cabinet shelf view |
| Network Ports | ✅ Enabled | ❌ Hidden |
| Expiration Tracking | ❌ Disabled | ✅ Enabled |
| Lot/Batch Numbers | ❌ Disabled | ✅ Enabled |
| Par Level Alerts | Optional | ✅ Enabled |
| FEFO Suggestions | ❌ Disabled | ✅ Enabled |

---

## Setting Up Healthcare Vertical

### Method 1: During Onboarding

When creating a new tenant, specify the healthcare vertical:

```bash
POST /api/v1/tenants/onboard

{
  "company_name": "City General Hospital",
  "admin_email": "admin@citygeneral.org",
  "admin_password": "SecurePassword123!",
  "vertical_pack": "healthcare"  # <-- Key setting
}
```

### Method 2: Apply Preset to Existing Tenant

For existing tenants, apply the healthcare preset:

```bash
POST /api/v1/whitelabel/presets/apply

{
  "preset": "healthcare",
  "reset_terminology": true,    # Apply healthcare terminology
  "reset_features": true        # Enable healthcare features
}
```

### Method 3: Via Settings UI

1. Navigate to **Settings** → **White-Label**
2. Click **Vertical Pack** tab
3. Select **Healthcare** from the dropdown
4. Click **Apply Preset**
5. Confirm terminology and feature changes

---

## Healthcare Terminology

### Complete Healthcare Preset

```json
{
  "item": "Supply",
  "items": "Supplies",
  "location": "Facility",
  "locations": "Facilities",
  "bin": "Cabinet",
  "bins": "Cabinets",
  "check_out": "Dispense",
  "check_in": "Restock",
  "category": "Supply Category",
  "categories": "Supply Categories",
  "lifecycle": "Supply Status",
  "storage": "Supply Room",
  "stock": "Inventory",
  "container": "Storage Location",
  "containers": "Storage Locations",
  "unit": "Shelf",
  "units": "Shelves"
}
```

### Customizing Terminology

You can further customize for your specific context:

```bash
PUT /api/v1/whitelabel/terminology

{
  "location": "Hospital",
  "locations": "Hospitals",
  "bin": "Med Cart",
  "bins": "Med Carts",
  "item": "Medical Supply",
  "items": "Medical Supplies"
}
```

### Example UI After Customization

```
┌─────────────────────────────────────────────────────────────┐
│   City General Hospital - Medical Supply Management         │
├─────────────────────────────────────────────────────────────┤
│ 📊 Dashboard  │  📦 Medical Supplies  │  🏥 Hospitals  │      │
├─────────────────────────────────────────────────────────────┤
│  Medical Supplies Expiring Soon:  12                         │
│  Low Inventory Alerts:            5                         │
│  Supplies Dispensed Today:        47                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Healthcare-Specific Features

### Enabling Healthcare Features

Healthcare features are plugin-based. Enable them via:

```bash
PUT /api/v1/whitelabel/features

{
  "expiration_tracking": true,
  "lot_batch_numbers": true,
  "par_level_alerts": true,
  "sterilization_tracking": true,
  "power_efficiency": false,        # Hide datacenter feature
  "rack_visualization": false       # Hide datacenter feature
}
```

### Available Plugins

| Plugin | Default | Description |
|--------|---------|-------------|
| `expiration_tracking` | ✅ On | Track dates, get alerts |
| `par_levels` | ✅ On | Minimum stock alerts |
| `sterilization` | Off | Sterilization cycle tracking |
| `compliance` | Off | FDA/HIPAA compliance features |

---

## Expiration Tracking

### Overview

The Expiration Tracking plugin helps healthcare facilities:
- Track expiration dates on all supplies
- Receive automated alerts before expiration
- Suggest FEFO (First Expired, First Out) picking order
- Generate reports on expiring and expired inventory

### Configuring Expiration Tracking

```bash
PUT /api/v1/plugins/expiration_tracking/config

{
  "warning_days": 30,              # Alert 30 days before expiration
  "critical_days": 7,              # Critical alert 7 days before
  "enable_email_alerts": true,
  "alert_recipients": [
    "supply-manager@hospital.org",
    "pharmacy@hospital.org"
  ],
  "enable_fefo": true,             # Show FEFO picking suggestions
  "track_lot_numbers": true        # Enable lot number field
}
```

### Adding Expiration Dates to Supplies

When creating or editing a supply:

```json
{
  "name": "Surgical Gloves - Medium",
  "type": "consumable",
  "quantity": 500,
  "custom_fields": {
    "expiration_date": "2025-06-15",
    "lot_number": "LOT-2024-001234",
    "manufacture_date": "2024-01-15"
  }
}
```

### Expiration Dashboard Widgets

The healthcare dashboard includes:

1. **Items Expiring Soon** - Count by severity (warning/critical)
2. **Expired Items** - Items past expiration date
3. **Expiration Calendar** - Visual calendar view

```
┌─────────────────────────────────────────────────────────────┐
│  🔴 Expiring in 7 days:   8 items                           │
│  🟡 Expiring in 30 days:  23 items                          │
│  ⚫ Already Expired:      2 items                           │
├─────────────────────────────────────────────────────────────┤
│  [View Expiring]  [View Expired]  [Generate Report]         │
└─────────────────────────────────────────────────────────────┘
```

### FEFO (First Expired, First Out)

When dispensing supplies, the system suggests picking order:

```
┌─────────────────────────────────────────────────────────────┐
│  FEFO Picking Order for: Surgical Gloves - Medium          │
├─────────────────────────────────────────────────────────────┤
│  1. LOT-2024-001234  |  Expires: 2025-01-15  |  Qty: 50    │
│  2. LOT-2024-001456  |  Expires: 2025-02-20  |  Qty: 100   │
│  3. LOT-2024-002789  |  Expires: 2025-06-15  |  Qty: 350   │
└─────────────────────────────────────────────────────────────┘
```

### Expiration Reports

Available reports:

```json
[
  {
    "id": "expiration_summary",
    "name": "Expiration Summary",
    "description": "Summary of items by expiration status"
  },
  {
    "id": "lot_traceability",
    "name": "Lot Traceability Report",
    "description": "Track all items by lot number"
  },
  {
    "id": "waste_analysis",
    "name": "Waste Analysis",
    "description": "Analysis of expired and disposed items"
  }
]
```

---

## Lot/Batch Number Tracking

### Purpose

Lot numbers enable:
- **Recall Management** - Quickly find affected items
- **Traceability** - Track item history
- **Quality Control** - Identify problematic batches
- **Compliance** - FDA 21 CFR Part 11 requirements

### Adding Lot Numbers

```json
{
  "name": "Medication XYZ 100mg",
  "custom_fields": {
    "lot_number": "LOT-ABC-2024-00567",
    "ndc_code": "12345-6789-01",
    "manufacture_date": "2024-06-01",
    "expiration_date": "2026-06-01"
  }
}
```

### Recall Search

Find all items by lot number:

```bash
GET /api/v1/supplies/search?lot_number=LOT-ABC-2024-00567

Response:
{
  "items": [
    {
      "id": 123,
      "name": "Medication XYZ 100mg",
      "lot_number": "LOT-ABC-2024-00567",
      "location": "Pharmacy - Shelf B3",
      "quantity": 50,
      "status": "in_stock"
    },
    {
      "id": 456,
      "name": "Medication XYZ 100mg",
      "lot_number": "LOT-ABC-2024-00567",
      "location": "ER Supply Cabinet",
      "quantity": 10,
      "status": "in_use"
    }
  ],
  "total_quantity": 60,
  "locations_affected": 2
}
```

---

## Par Level Alerts

### Overview

Par levels define minimum inventory thresholds. When stock falls below par level, alerts are triggered.

### Configuring Par Levels

```bash
PUT /api/v1/plugins/par_levels/config

{
  "enable_alerts": true,
  "check_frequency": "hourly",
  "alert_channels": ["email", "dashboard"],
  "alert_recipients": ["supply-manager@hospital.org"]
}
```

### Setting Par Levels per Item

```bash
PUT /api/v1/supplies/{id}/par-level

{
  "par_level": 100,           # Minimum quantity
  "reorder_quantity": 200,    # How much to order
  "reorder_lead_days": 5      # Days to receive order
}
```

### Par Level Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠️ Low Stock Alerts (Below Par Level)                      │
├─────────────────────────────────────────────────────────────┤
│  Surgical Gloves - Medium    |  Current: 45   |  Par: 100  │
│  Gauze Pads 4x4              |  Current: 20   |  Par: 50   │
│  Alcohol Swabs               |  Current: 150  |  Par: 200  │
├─────────────────────────────────────────────────────────────┤
│  [Generate Purchase Order]   [Dismiss All]                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Compliance Considerations

### HIPAA Compliance

RackPlane supports HIPAA compliance for healthcare facilities:

- **Audit Logging** - All access and changes logged
- **Role-Based Access** - Limit data access by role
- **Data Encryption** - Data encrypted at rest and in transit
- **Access Reports** - Generate access audit reports

### FDA 21 CFR Part 11

For facilities under FDA regulations:

- **Electronic Records** - Complete audit trail
- **Electronic Signatures** - User authentication
- **Data Integrity** - Immutable audit logs
- **Traceability** - Lot number tracking

### Best Practices

1. **Enable Audit Logging** - Capture all inventory changes
2. **Use Role-Based Access** - Limit sensitive data access
3. **Regular Backups** - Automated daily backups
4. **Lot Number Tracking** - Always capture lot numbers
5. **Expiration Management** - Review expiring items weekly

---

## Use Cases

### Use Case 1: Hospital Central Supply

**Scenario:** Large hospital managing medical supplies across multiple departments.

**Configuration:**
```json
{
  "terminology": {
    "location": "Hospital Wing",
    "bin": "Supply Cabinet"
  },
  "features": {
    "expiration_tracking": true,
    "par_level_alerts": true,
    "sterilization_tracking": true
  }
}
```

**Workflow:**
1. Receive supplies at Central Supply
2. Record lot numbers and expiration dates
3. Distribute to department cabinets
4. Track usage via dispense actions
5. Receive low stock alerts
6. Reorder before depletion

### Use Case 2: Clinic Medical Supplies

**Scenario:** Multi-location clinic network tracking basic medical supplies.

**Configuration:**
```json
{
  "terminology": {
    "location": "Clinic",
    "locations": "Clinics"
  },
  "features": {
    "expiration_tracking": true,
    "par_level_alerts": false  # Manual reordering
  }
}
```

### Use Case 3: Pharmacy Medication Management

**Scenario:** Hospital pharmacy tracking controlled and non-controlled medications.

**Configuration:**
```json
{
  "terminology": {
    "item": "Medication",
    "items": "Medications",
    "check_out": "Dispense"
  },
  "features": {
    "expiration_tracking": true,
    "lot_batch_numbers": true  # Critical for recalls
  }
}
```

---

## Quick Reference

### Healthcare API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/plugins/expiration_tracking/expiring` | Get expiring items |
| `GET /api/v1/plugins/expiration_tracking/expired` | Get expired items |
| `GET /api/v1/plugins/expiration_tracking/fefo/{category}` | Get FEFO order |
| `GET /api/v1/plugins/expiration_tracking/lot/{lot_number}` | Find by lot |
| `GET /api/v1/plugins/par_levels/alerts` | Get low stock alerts |
| `PUT /api/v1/supplies/{id}/par-level` | Set par level |

### Healthcare Dashboard Widgets

- Expiring Items (30 days)
- Expired Items Count
- Low Stock Alerts
- Recent Dispenses
- Expiration Calendar

### Terminology Quick Switch

```bash
# Switch to healthcare
POST /api/v1/whitelabel/presets/apply
{"preset": "healthcare", "reset_terminology": true}

# Switch back to datacenter
POST /api/v1/whitelabel/presets/apply
{"preset": "datacenter", "reset_terminology": true}
```

---

## Next Steps

- [White-Label Configuration](WHITE_LABEL.md) - Full customization options
- [Asset Management](ASSET_MANAGEMENT.md) - General asset operations
- [Administrator Guide](ADMINISTRATOR_GUIDE.md) - User and tenant management
- [Warehouse Vertical Guide](WAREHOUSE_VERTICAL.md) - Warehouse-specific features
