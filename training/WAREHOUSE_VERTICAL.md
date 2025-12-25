# Warehouse Vertical Guide

## RackPlane for Warehouse & Logistics Inventory

This guide covers how to configure and use RackPlane for warehouse operations, distribution centers, and logistics inventory management.

---

## Table of Contents

1. [Overview](#overview)
2. [Warehouse vs Datacenter](#warehouse-vs-datacenter)
3. [Setting Up Warehouse Vertical](#setting-up-warehouse-vertical)
4. [Warehouse Terminology](#warehouse-terminology)
5. [Warehouse-Specific Features](#warehouse-specific-features)
6. [Bin Location Management](#bin-location-management)
7. [Pick/Pack Workflows](#pickpack-workflows)
8. [Inventory Counts](#inventory-counts)
9. [Use Cases](#use-cases)

---

## Overview

RackPlane's **Warehouse Vertical Pack** adapts the platform for warehouse and logistics environments. Ideal for:

- **Distribution Centers** - Track inventory across zones
- **Warehouses** - Manage bin locations and picking
- **Fulfillment Centers** - Support pick/pack operations
- **Manufacturing** - Track raw materials and WIP
- **Retail Backroom** - Store inventory management

### Key Warehouse Features

| Feature | Description |
|---------|-------------|
| **Bin Location System** | Organize by zone, aisle, shelf, bin |
| **Pick/Pack Workflows** | Guided picking and packing |
| **Inventory Counts** | Cycle counts and full inventories |
| **Expiration Tracking** | FEFO for perishable goods |
| **Par Level Alerts** | Reorder point notifications |
| **Barcode Scanning** | Fast inventory operations |

---

## Warehouse vs Datacenter

### Terminology Comparison

| Concept | Datacenter | Warehouse |
|---------|------------|-----------|
| Primary items | Assets | Items |
| Primary items (plural) | Assets | Items |
| Main location | Datacenter | Warehouse |
| Main locations (plural) | Datacenters | Warehouses |
| Storage unit | Rack | Shelf |
| Storage units | Racks | Shelves |
| Deploy action | Deploy | Pick |
| Return action | Return | Receive |
| Category | Asset Type | SKU Category |
| Status | Status | Item Status |
| Storage area | Storage | Zone |
| Container | Storage Container | Bin Location |
| Position | U-Space | Slot |

### Feature Differences

| Feature | Datacenter | Warehouse |
|---------|------------|-----------|
| Power Efficiency | ✅ Enabled | ❌ Hidden |
| Rack Visualization | ✅ U-slot view | ⚡ Zone/Aisle view |
| Network Ports | ✅ Enabled | ❌ Hidden |
| Bin Locations | ❌ Disabled | ✅ Enabled |
| Pick/Pack | ❌ Disabled | ✅ Enabled |
| Inventory Counts | Basic | ✅ Enhanced |
| Expiration Tracking | ❌ Disabled | Optional |
| Par Level Alerts | Optional | ✅ Enabled |

---

## Setting Up Warehouse Vertical

### Method 1: During Onboarding

```bash
POST /api/v1/tenants/onboard

{
  "company_name": "FastShip Fulfillment",
  "admin_email": "admin@fastship.com",
  "admin_password": "SecurePassword123!",
  "vertical_pack": "warehouse"
}
```

### Method 2: Apply Preset

```bash
POST /api/v1/whitelabel/presets/apply

{
  "preset": "warehouse",
  "reset_terminology": true,
  "reset_features": true
}
```

---

## Warehouse Terminology

### Complete Warehouse Preset

```json
{
  "item": "Item",
  "items": "Items",
  "location": "Warehouse",
  "locations": "Warehouses",
  "bin": "Shelf",
  "bins": "Shelves",
  "check_out": "Pick",
  "check_in": "Receive",
  "category": "SKU Category",
  "categories": "SKU Categories",
  "lifecycle": "Item Status",
  "storage": "Zone",
  "stock": "Stock",
  "container": "Bin Location",
  "containers": "Bin Locations",
  "unit": "Slot",
  "units": "Slots"
}
```

### Customizing Terminology

```bash
PUT /api/v1/whitelabel/terminology

{
  "location": "Distribution Center",
  "locations": "Distribution Centers",
  "check_out": "Fulfill",
  "container": "Pick Bin"
}
```

### Example UI

```
┌─────────────────────────────────────────────────────────────┐
│   FastShip Fulfillment - Warehouse Management               │
├─────────────────────────────────────────────────────────────┤
│ 📊 Dashboard  │  📦 Items  │  🏢 Warehouses  │  📋 Orders   │
├─────────────────────────────────────────────────────────────┤
│  Total Items:      15,420                                   │
│  Low Stock Alerts:  12                                      │
│  Picks Today:      347                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Warehouse-Specific Features

### Location Hierarchy

Warehouse uses a different location model:

```
Warehouse (Distribution Center)
├── Zone (A, B, C, Bulk, etc.)
│   ├── Aisle (01, 02, 03...)
│   │   ├── Shelf (A, B, C, D...)
│   │   │   ├── Bin/Slot (1, 2, 3...)
│   │   │   └── Bin/Slot
│   │   └── Shelf
│   └── Aisle
└── Receiving Area
```

### Bin Location Codes

Standard format: `ZONE-AISLE-SHELF-BIN`

Examples:
- `A-01-B-03` - Zone A, Aisle 01, Shelf B, Bin 03
- `BULK-05-A-01` - Bulk Zone, Aisle 05, Shelf A, Bin 01
- `RECV-01` - Receiving Area, Location 01

### Creating Locations

```bash
# Create warehouse
POST /api/v1/locations/warehouses/
{
  "name": "East Coast Distribution",
  "code": "ECDC",
  "address": "123 Logistics Way"
}

# Create zones
POST /api/v1/locations/zones/
{
  "name": "Zone A - Fast Moving",
  "code": "A",
  "warehouse_id": 1,
  "type": "pick"
}

# Create bin locations
POST /api/v1/locations/bins/
{
  "code": "A-01-B-03",
  "zone_id": 1,
  "aisle": "01",
  "shelf": "B",
  "bin": "03",
  "capacity": 50
}
```

---

## Bin Location Management

### Bin Types

| Type | Description | Use Case |
|------|-------------|----------|
| **Pick** | Primary picking locations | Fast-moving items |
| **Bulk** | Large quantity storage | Overstock, pallets |
| **Reserve** | Backup storage | Replenishment stock |
| **Receiving** | Inbound staging | New arrivals |
| **Shipping** | Outbound staging | Ready to ship |
| **Returns** | Return processing | RMA items |

### Bin Capacity

Track capacity by:
- **Units** - Number of items
- **Weight** - Maximum weight (lbs/kg)
- **Volume** - Cubic dimensions

```json
{
  "code": "A-01-B-03",
  "max_units": 100,
  "max_weight_lbs": 50,
  "max_volume_cuft": 2.5
}
```

### Bin Utilization

```
┌─────────────────────────────────────────────────────────────┐
│  Bin Location: A-01-B-03                                    │
├─────────────────────────────────────────────────────────────┤
│  SKU: WIDGET-001         |  Qty: 45 / 100                   │
│  ██████████████░░░░░░░░  |  45% Full                        │
│  Last Pick: 10 min ago   |  Picks Today: 12                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Pick/Pack Workflows

### Pick Types

| Type | Description |
|------|-------------|
| **Single Order** | Pick items for one order |
| **Batch Pick** | Pick multiple orders in one trip |
| **Zone Pick** | Pick specific zones, pass to next |
| **Wave Pick** | Scheduled pick waves |

### Pick Process

1. **Receive Order** - Orders imported or created
2. **Generate Pick List** - System optimizes pick path
3. **Pick Items** - Scan bins and items
4. **Verify Quantities** - Confirm correct amounts
5. **Pack** - Package for shipping
6. **Ship** - Generate labels, mark complete

### Optimized Pick Path

System suggests optimal walking path:

```
┌─────────────────────────────────────────────────────────────┐
│  Pick List #1234 - 8 items                                  │
├─────────────────────────────────────────────────────────────┤
│  ☐ 1. A-01-A-01  |  SKU-001  |  Qty: 2  |  ---->            │
│  ☐ 2. A-01-B-02  |  SKU-045  |  Qty: 1  |  ↓                │
│  ☐ 3. A-02-A-03  |  SKU-102  |  Qty: 3  |  ---->            │
│  ☐ 4. A-02-C-01  |  SKU-089  |  Qty: 1  |  ↓                │
│  ☐ 5. B-01-A-02  |  SKU-234  |  Qty: 5  |  ======>          │
├─────────────────────────────────────────────────────────────┤
│  [Start Pick]  [Print List]                                 │
└─────────────────────────────────────────────────────────────┘
```

### Barcode Scanning

For each pick:
1. Scan bin location barcode
2. Scan item barcode
3. Enter/confirm quantity
4. System moves to next pick

---

## Inventory Counts

### Count Types

| Type | Frequency | Scope |
|------|-----------|-------|
| **Cycle Count** | Daily/Weekly | Subset of bins |
| **Full Count** | Monthly/Quarterly | All inventory |
| **ABC Count** | Varies | By item velocity |
| **Spot Count** | As needed | Specific discrepancies |

### Cycle Count Schedule

```json
{
  "schedule": {
    "A_items": "weekly",      // High velocity - count weekly
    "B_items": "monthly",     // Medium velocity - monthly
    "C_items": "quarterly"    // Low velocity - quarterly
  }
}
```

### Performing Counts

1. **Generate Count Sheet** - System creates count list
2. **Count Items** - Physical count at each location
3. **Enter Counts** - Record in system
4. **Review Variances** - Investigate discrepancies
5. **Adjust Inventory** - Approve adjustments

### Variance Reports

```
┌─────────────────────────────────────────────────────────────┐
│  Cycle Count #567 - Variance Report                         │
├─────────────────────────────────────────────────────────────┤
│  Location    |  SKU       |  System |  Counted |  Variance  │
│  A-01-B-03   |  WIDGET-01 |    45   |    43    |    -2      │
│  A-02-A-01   |  GADGET-05 |    20   |    22    |    +2      │
│  B-01-C-02   |  PART-789  |    100  |    97    |    -3      │
├─────────────────────────────────────────────────────────────┤
│  Total Items Counted: 847   |   Accuracy: 99.2%             │
│  [Approve Adjustments]  [Review]                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Integration with Other Features

### Expiration Tracking

For perishable goods:

```bash
PUT /api/v1/whitelabel/features

{
  "expiration_tracking": true  # Enable for food/perishables
}
```

FEFO picking automatically prioritizes items expiring soonest.

### Par Level Alerts

Essential for warehouse operations:

```bash
PUT /api/v1/items/{id}/par-level

{
  "par_level": 500,
  "reorder_point": 200,
  "reorder_quantity": 1000,
  "lead_time_days": 7
}
```

### Low Stock Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠️ Below Reorder Point                                     │
├─────────────────────────────────────────────────────────────┤
│  SKU-001 Widget Large    |  Stock: 150  |  Par: 500  │ PO ✓ │
│  SKU-045 Gadget Small    |  Stock: 80   |  Par: 200  │ PO ✓ │
│  SKU-102 Part XYZ        |  Stock: 45   |  Par: 100  │      │
├─────────────────────────────────────────────────────────────┤
│  [Create Purchase Orders]  [Export List]                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Use Cases

### Use Case 1: E-commerce Fulfillment

**Scenario:** Fulfillment center shipping D2C orders.

**Configuration:**
```json
{
  "terminology": {
    "location": "Fulfillment Center",
    "check_out": "Ship"
  },
  "features": {
    "bin_locations": true,
    "pick_pack": true,
    "batch_picking": true,
    "par_level_alerts": true
  }
}
```

### Use Case 2: 3PL Warehouse

**Scenario:** Third-party logistics with multiple clients.

**Configuration:**
- Use multi-tenant for client separation
- Each client = separate tenant
- Shared warehouse locations with client tags

### Use Case 3: Manufacturing Parts

**Scenario:** Factory managing raw materials and components.

**Configuration:**
```json
{
  "terminology": {
    "item": "Part",
    "items": "Parts",
    "location": "Factory",
    "check_out": "Issue",
    "check_in": "Return"
  }
}
```

---

## Quick Reference

### Warehouse API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/locations/warehouses/` | List warehouses |
| `GET /api/v1/locations/zones/` | List zones |
| `GET /api/v1/locations/bins/` | List bin locations |
| `POST /api/v1/picks/` | Create pick list |
| `GET /api/v1/picks/{id}` | Get pick details |
| `POST /api/v1/counts/` | Create count session |
| `PUT /api/v1/counts/{id}/entries` | Record count entries |
| `GET /api/v1/reports/variance` | Variance report |

### Warehouse Dashboard Widgets

- Total Inventory Value
- Low Stock Alerts  
- Picks In Progress
- Receiving Pending
- Bin Utilization
- Daily Pick Activity

---

## Next Steps

- [White-Label Configuration](WHITE_LABEL.md) - Full customization options
- [Asset Management](ASSET_MANAGEMENT.md) - General item operations
- [Healthcare Vertical](HEALTHCARE_VERTICAL.md) - Healthcare-specific features
- [Administrator Guide](ADMINISTRATOR_GUIDE.md) - System administration
