# Asset Management Training

## Complete Guide to Managing Assets in RackPlane

This training module covers everything you need to know about asset management, from basic operations to advanced workflows.

---

## Table of Contents

1. [Understanding Assets](#understanding-assets)
2. [Creating Assets](#creating-assets)
3. [Asset Lifecycle](#asset-lifecycle)
4. [Searching and Filtering](#searching-and-filtering)
5. [Bulk Operations](#bulk-operations)
6. [Stock Management](#stock-management)
7. [Serial Number Management](#serial-number-management)
8. [Best Practices](#best-practices)

---

## Understanding Assets

### What is an Asset?

An **asset** in RackPlane represents any physical equipment that you want to track. This includes:

- **Compute**: Servers, workstations, blades
- **Network**: Switches, routers, firewalls, load balancers
- **Storage**: NAS, SAN, disk arrays
- **Power**: PDUs, UPS, power cables
- **Connectivity**: Cables, transceivers, patch panels
- **Infrastructure**: KVM switches, console servers

### Asset Data Model

```
Asset
├── Identity
│   ├── Name
│   ├── Serial Number
│   ├── Asset Tag
│   └── Model
├── Classification
│   ├── Type (Server, Switch, etc.)
│   ├── Manufacturer
│   └── Custom Fields
├── Location
│   ├── Datacenter
│   ├── Room
│   ├── Rack + U-Position
│   └── OR Storage Container
├── Status
│   ├── Active / Storage / Decommissioned
│   └── Maintenance State
├── Lifecycle
│   ├── Purchase Date
│   ├── Warranty Expiration
│   └── End of Life Date
└── Relationships
    ├── Network Ports
    ├── Connected Cables
    └── Parent/Child Assets
```

---

## Creating Assets

### Method 1: Manual Creation

**Steps:**

1. Navigate to **Assets** page
2. Click **+ Add Asset**
3. Select the asset type
4. Fill in the form:

```
┌─────────────────────────────────────────────────────────────┐
│ Create New Asset                                    [Close] │
├─────────────────────────────────────────────────────────────┤
│ Type:        [Server          ▼]                            │
│ Name:        [Web Server 01        ]                        │
│ Serial:      [ABC123XYZ789         ]                        │
│ Asset Tag:   [ASSET-001            ]                        │
│ Model:       [Dell PowerEdge R750  ]                        │
│                                                             │
│ Location:    [Datacenter ▼] [Rack ▼] [U: __ ] [Height: __ ]│
│              ☐ Add to Stock instead                        │
│                                                             │
│ [Cancel]                                   [Create Asset]   │
└─────────────────────────────────────────────────────────────┘
```

### Method 2: OCR Scanning

For assets with labels:

1. Click **📷 Scan Label**
2. Point camera at the asset label
3. RackPlane extracts:
   - Serial number
   - Model number
   - Manufacturer
4. Review and complete missing fields
5. Save the asset

### Method 3: Vendor Product Search

Search vendor catalogs (Pro+):

1. Click **🔍 Search Products**
2. Enter product name or part number
3. Select from results (Mouser, FS.com)
4. Product details auto-populate
5. Add quantity and location
6. Save

### Method 4: CSV Import

For bulk creation:

1. Download CSV template
2. Fill in asset data
3. Required columns:
   - `name`
   - `type`
   - `serial_number`
4. Optional columns:
   - `model`, `manufacturer`
   - `datacenter_code`, `rack_code`, `u_position`
   - `purchase_date`, `warranty_expiration`
5. Upload and review
6. Confirm import

**Sample CSV:**
```csv
name,type,serial_number,model,datacenter_code,rack_code,u_position
Web Server 01,server_device,ABC123,PowerEdge R750,DC1,A01,10
Web Server 02,server_device,ABC124,PowerEdge R750,DC1,A01,12
Core Switch,switch_device,SW001,Nexus 9300,DC1,A01,40
```

---

## Asset Lifecycle

### Status Transitions

```
                    ┌─────────────────┐
                    │    PLANNED      │
                    └────────┬────────┘
                             │ Purchase/Receive
                             ▼
                    ┌─────────────────┐
         ┌─────────│    STORAGE      │◄────────────┐
         │         └────────┬────────┘             │
         │                  │ Deploy               │ Return to Storage
         │                  ▼                      │
         │         ┌─────────────────┐             │
         │         │     ACTIVE      │─────────────┘
         │         └────────┬────────┘
         │                  │
         │    ┌─────────────┼─────────────┐
         │    │             │             │
         │    ▼             ▼             ▼
         │ ┌──────┐   ┌──────────┐   ┌──────────┐
         │ │MAINT.│   │ RESERVED │   │DECOMM.   │
         │ └──────┘   └──────────┘   └──────────┘
         │    │             │
         │    └─────────────┼──── Return to Active
         │                  │
         └──────────────────┘
```

### Automatic Status Changes

RackPlane automatically updates status when:

| Action | Status Change |
|--------|---------------|
| Assign to rack | Storage → Active |
| Move to container | Active → Storage |
| Connect cable | Cable moves from Storage → Active |
| Disconnect cable | Option to return to Storage |
| Set decommission date | Active → Decommissioned |

---

## Searching and Filtering

### Quick Search

Type in the search bar to search across:
- Asset name
- Serial number
- Asset tag
- Model

### Advanced Filters

Click **Filters** to filter by:

| Filter | Options |
|--------|---------|
| **Type** | Server, Switch, Cable, etc. |
| **Status** | Active, Storage, Decommissioned |
| **Location** | Datacenter, Room, Rack |
| **Container** | Storage containers |
| **Manufacturer** | Vendor/brand |
| **Date Range** | Created, purchased, warranty |

### Saved Filters

Save frequently used filter combinations:
1. Apply filters
2. Click **Save Filter**
3. Name your filter
4. Access from **Saved Filters** dropdown

### Example Searches

```
# Find all Dell servers
type:server_device manufacturer:Dell

# Find assets expiring within 30 days
warranty_expiring:30d

# Find all items in DC1, Rack A01
datacenter:DC1 rack:A01

# Find all cables in storage
type:*_cable status:storage
```

---

## Bulk Operations

### Selecting Multiple Assets

1. Check the checkbox next to assets
2. Or click **Select All** for current page
3. Selected count appears in toolbar

### Available Bulk Actions

| Action | Description |
|--------|-------------|
| **Move** | Change location for all selected |
| **Update Status** | Change status in bulk |
| **Export** | Download selected as CSV |
| **Print Labels** | Generate QR labels |
| **Delete** | Remove selected (with confirmation) |
| **Tag** | Add tags to selected |

### Bulk Move Example

1. Select assets to move
2. Click **Move**
3. Select destination:
   - Datacenter/Rack/U-position
   - Or Storage Container
4. Confirm move

---

## Stock Management

### Understanding Stock vs. Deployed

| State | Location | Use Case |
|-------|----------|----------|
| **Deployed** | Rack + U-position | Active equipment |
| **Stock** | Storage Container | Spare parts, cables |

### Storage Containers

Organize spare inventory:

```
Storage Room
├── Cabinet 1
│   ├── Shelf A (DAC Cables)
│   ├── Shelf B (Transceivers)
│   └── Shelf C (Power Cables)
├── Cabinet 2
│   ├── Drawer 1 (Spare NICs)
│   └── Drawer 2 (Console Cables)
└── Spare Parts Box
    └── Miscellaneous
```

### Creating Containers

1. Navigate to **Stock** → **Containers**
2. Click **+ Add Container**
3. Enter:
   - Name
   - Type (Box, Shelf, Drawer, Cabinet)
   - Location description
4. Save

### Stock Levels

Track inventory levels:

- Set **minimum quantity** for alerts
- View **current count**
- Get **low stock alerts** (Starter+)

### Adding Items to Stock

When creating an asset:
1. Check **"Add to Stock"**
2. Select container
3. Enter quantity (for consumables)
4. Save

---

## Serial Number Management

### Importance of Serial Numbers

Serial numbers enable:
- ✅ Warranty lookups
- ✅ Vendor support tickets
- ✅ Audit compliance
- ✅ Asset tracking

### Serial Number Formats

RackPlane tracks various formats:

| Vendor | Format Example |
|--------|----------------|
| Dell | `ABCD123` |
| HP/HPE | `CZ12345678` |
| Cisco | `FOC12345ABC` |
| Arista | `SSJ12345678` |

### Duplicate Detection

RackPlane warns if a serial number already exists:
- Shows existing asset details
- Prevents accidental duplicates
- Can override if intentional

### Serial Number History

View serial number changes:
1. Open asset details
2. Click **History** tab
3. See all modifications

---

## Best Practices

### 1. Naming Conventions

**Do:**
```
WEB-SVR-01, WEB-SVR-02    (Consistent, searchable)
CORE-SW-A01-01            (Includes location)
```

**Don't:**
```
webserver1, Web Server Two    (Inconsistent)
The main switch in DC1        (Too verbose)
```

### 2. Complete Data Entry

Fill in all relevant fields:
- Serial number (for warranty)
- Purchase date (for depreciation)
- Warranty expiration (for alerts)

### 3. Regular Audits

Schedule periodic audits:
1. Generate asset report
2. Physical verification
3. Update discrepancies
4. Document changes

### 4. Use Asset Tags

Print and apply QR code labels:
- Enables quick scanning
- Physical verification
- Lost asset recovery

### 5. Document Changes

Use notes field for:
- Configuration changes
- Maintenance history
- Special requirements

### 6. Organize Stock

- Use meaningful container names
- Group similar items
- Set minimum stock levels
- Regular inventory counts

---

## Exercises

### Exercise 1: Create Your First Asset

1. Navigate to Assets
2. Click + Add Asset
3. Create a server:
   - Name: "TEST-SVR-01"
   - Type: Server
   - Serial: "TEST123"
4. Add to storage (not deployed)
5. Verify it appears in stock

### Exercise 2: Move Asset to Rack

1. Find TEST-SVR-01
2. Click Edit
3. Change location:
   - Select datacenter
   - Select rack
   - U-position: 10
4. Save
5. Verify status changed to Active

### Exercise 3: Bulk Import

1. Download CSV template
2. Add 5 test cables
3. Upload CSV
4. Review and confirm
5. Find imported assets

---

## Troubleshooting

### "Asset not saving"

- Check required fields (name, type)
- Verify serial number is unique
- Ensure valid U-position

### "Can't find asset"

- Check current filters
- Search by serial number
- Verify tenant context

### "Duplicate serial number"

- Review existing asset
- Merge if duplicate
- Override if legitimate

---

## Next Steps

- [Network Port Management](NETWORK_PORTS.md)
- [Cable Connections](CABLE_CONNECTIONS.md)
- [Label Printing](../guides/LABEL_PRINTING.md)
- [Reporting](REPORTS.md)
