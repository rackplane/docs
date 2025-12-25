# White-Label Configuration Training

## Customizing RackPlane for Your Organization

This guide covers how tenant administrators can customize RackPlane's branding, terminology, and features to match their organization's needs.

---

## Table of Contents

1. [What is White-Labeling?](#what-is-white-labeling)
2. [Branding Configuration](#branding-configuration)
3. [Terminology Customization](#terminology-customization)
4. [Vertical Packs](#vertical-packs)
5. [Feature Toggles](#feature-toggles)
6. [API Reference](#api-reference)
7. [Training Exercises](#training-exercises)

---

## What is White-Labeling?

White-labeling allows you to customize RackPlane to match your organization's brand identity and industry terminology. This is especially useful for:

- **MSPs**: Reselling to clients with their branding
- **Enterprises**: Matching corporate identity
- **Healthcare**: Using medical terminology
- **Warehouses**: Using logistics terminology

### Available Customizations

| Category | What You Can Change |
|----------|---------------------|
| **Branding** | Logo, colors, app name, favicon |
| **Terminology** | Asset names, location labels, UI text |
| **Features** | Enable/disable industry-specific features |
| **Vertical Pack** | Pre-configured industry settings |

---

## Branding Configuration

### Accessing Branding Settings

1. Navigate to **Settings** → **White-Label**
2. Or use API: `GET /api/v1/whitelabel/branding`

### Available Branding Options

#### Logo

```json
{
  "logo_url": "https://cdn.yourcompany.com/logo.png",
  "logo_alt_text": "YourCompany Logo"
}
```

**Requirements:**
- PNG or SVG format recommended
- Transparent background preferred
- Minimum 200x50 pixels
- Maximum 5MB file size

#### Colors

```json
{
  "primary_color": "#2563EB",      // Main accent color
  "secondary_color": "#1E40AF",    // Secondary actions
  "accent_color": "#3B82F6",       // Highlights
  "background_color": "#0F172A",   // Dark mode background
  "text_color": "#F8FAFC"          // Primary text
}
```

**Color Picker View:**
```
┌─────────────────────────────────────────────┐
│ Brand Colors                                 │
├─────────────────────────────────────────────┤
│ Primary:    [#2563EB] [████]   Preview      │
│ Secondary:  [#1E40AF] [████]                │
│ Accent:     [#3B82F6] [████]                │
├─────────────────────────────────────────────┤
│ [Reset to Defaults]         [Save Changes]  │
└─────────────────────────────────────────────┘
```

#### Application Name

```json
{
  "app_name": "DataFlow Manager",
  "company_name": "DataFlow Systems",
  "support_email": "support@dataflow.com",
  "support_url": "https://support.dataflow.com"
}
```

This changes:
- Browser tab title
- Login page header
- Help text and support links

#### Favicon

```json
{
  "favicon_url": "https://cdn.yourcompany.com/favicon.ico"
}
```

### Updating Branding via API

```bash
PUT /api/v1/whitelabel/branding

{
  "logo_url": "https://cdn.example.com/logo.png",
  "primary_color": "#10B981",
  "app_name": "Inventory Pro"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Branding updated successfully",
  "config": {
    "logo_url": "https://cdn.example.com/logo.png",
    "primary_color": "#10B981",
    "app_name": "Inventory Pro"
  }
}
```

---

## Terminology Customization

### Why Customize Terminology?

Different industries use different terms for the same concepts:

| Standard | Healthcare | Warehouse | Manufacturing |
|----------|------------|-----------|---------------|
| Asset | Medical Device | Inventory Item | Equipment |
| Datacenter | Medical Facility | Distribution Center | Factory |
| Rack | Device Cart | Aisle | Work Cell |
| Container | Supply Bin | Pick Bin | Parts Tray |

### Available Terminology Keys

```json
{
  // Core Entities
  "asset": "Asset",
  "assets": "Assets",
  "item": "Item",
  "items": "Items",
  
  // Locations
  "datacenter": "Datacenter",
  "datacenters": "Datacenters",
  "room": "Room",
  "rooms": "Rooms",
  "rack": "Rack",
  "racks": "Racks",
  
  // Storage
  "container": "Container",
  "containers": "Containers",
  "stock": "Stock",
  "storage": "Storage",
  
  // Actions
  "deploy": "Deploy",
  "decommission": "Decommission",
  "audit": "Audit"
}
```

### Getting Current Terminology

```bash
GET /api/v1/whitelabel/terminology

Response:
{
  "asset": "Medical Device",
  "datacenter": "Medical Facility",
  "rack": "Device Cart",
  "container": "Supply Bin",
  ...
}
```

### Updating Terminology

```bash
PUT /api/v1/whitelabel/terminology

{
  "asset": "Equipment",
  "datacenter": "Facility",
  "rack": "Cabinet"
}
```

Only include keys you want to change. Unspecified keys retain their current values.

### Terminology in Action

**Before (Default):**
```
Dashboard > Datacenters > Primary DC > Racks > A01 > Assets
"Add new asset to rack"
```

**After (Healthcare):**
```
Dashboard > Medical Facilities > Main Hospital > Device Carts > A01 > Medical Devices
"Add new medical device to device cart"
```

---

## Vertical Packs

### What are Vertical Packs?

Vertical packs are pre-configured bundles of:
- Industry-specific terminology
- Feature toggles
- Default asset types
- UI customizations

### Available Vertical Packs

#### 1. Datacenter (Default)

Optimized for datacenter infrastructure management.

**Features:**
- ✅ Power efficiency tracking
- ✅ Rack visualization
- ✅ Environmental monitoring
- ✅ Network port management
- ✅ Cable connections

**Terminology:**
- Asset → Asset
- Datacenter → Datacenter
- Rack → Rack

#### 2. Healthcare

Optimized for medical device and supply management.

**Features:**
- ✅ Compliance tracking (FDA, HIPAA)
- ✅ Sterilization date tracking
- ✅ Lot/batch number support
- ✅ Expiration alerts
- ✅ Maintenance schedules
- ❌ Power efficiency (hidden)

**Terminology:**
- Asset → Medical Device
- Datacenter → Medical Facility
- Rack → Equipment Cart
- Container → Supply Bin

#### 3. Warehouse

Optimized for warehouse and logistics inventory.

**Features:**
- ✅ Bin location management
- ✅ Pick/pack workflows
- ✅ Inventory counts
- ✅ Low stock alerts
- ✅ Barcode scanning
- ❌ Rack visualization (hidden)

**Terminology:**
- Asset → Inventory Item
- Datacenter → Distribution Center
- Rack → Aisle
- Container → Pick Bin

### Listing Available Presets

```bash
GET /api/v1/whitelabel/presets

Response:
{
  "presets": [
    {
      "id": "datacenter",
      "name": "Datacenter",
      "description": "Datacenter infrastructure management",
      "terminology": {...},
      "features": {...}
    },
    {
      "id": "healthcare",
      "name": "Healthcare",
      ...
    },
    {
      "id": "warehouse",
      "name": "Warehouse",
      ...
    }
  ]
}
```

### Applying a Vertical Pack

```bash
POST /api/v1/whitelabel/presets/apply

{
  "preset": "healthcare",
  "reset_terminology": true,    // Reset all terminology to preset defaults
  "reset_features": true        // Reset feature toggles to preset defaults
}
```

**Response:**
```json
{
  "success": true,
  "message": "Healthcare vertical pack applied successfully",
  "applied_preset": "healthcare",
  "terminology_reset": true,
  "features_reset": true
}
```

---

## Feature Toggles

### Controlling Feature Visibility

Enable or disable specific features for your tenant:

```json
{
  // Core Features
  "power_efficiency": true,     // Power tracking & PUE
  "rack_visualization": true,   // Visual rack diagrams
  "network_ports": true,        // Port management
  "cable_connections": true,    // Port-to-port cables
  
  // Healthcare Features
  "compliance_tracking": false,
  "sterilization_dates": false,
  "lot_batch_numbers": false,
  
  // Warehouse Features
  "bin_locations": false,
  "pick_pack_workflow": false,
  "inventory_counts": false,
  
  // General
  "environmental_monitoring": true,
  "label_printing": true,
  "ocr_scanning": true,
  "vendor_integration": true
}
```

### Getting Current Features

```bash
GET /api/v1/whitelabel/features

Response:
{
  "power_efficiency": true,
  "rack_visualization": true,
  "compliance_tracking": false,
  ...
}
```

### Updating Features

```bash
PUT /api/v1/whitelabel/features

{
  "power_efficiency": false,    // Hide power efficiency features
  "compliance_tracking": true   // Enable compliance tracking
}
```

### Feature Visibility in UI

When a feature is disabled:
- Related menu items are hidden
- Related buttons don't appear
- API endpoints remain accessible (for flexibility)

---

## API Reference

### Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/whitelabel/config` | Get complete config |
| GET | `/api/v1/whitelabel/branding` | Get branding only |
| PUT | `/api/v1/whitelabel/branding` | Update branding |
| GET | `/api/v1/whitelabel/terminology` | Get terminology |
| PUT | `/api/v1/whitelabel/terminology` | Update terminology |
| GET | `/api/v1/whitelabel/features` | Get feature flags |
| PUT | `/api/v1/whitelabel/features` | Update features |
| GET | `/api/v1/whitelabel/presets` | List presets |
| GET | `/api/v1/whitelabel/presets/{name}` | Get preset details |
| POST | `/api/v1/whitelabel/presets/apply` | Apply a preset |
| GET | `/api/v1/whitelabel/terminology/keys` | List all keys |
| GET | `/api/v1/whitelabel/display-name` | Get display name |

### Authentication

All white-label endpoints require authentication.
Branding updates require `TENANT_ADMIN` role or higher.

### Complete Config Response

```bash
GET /api/v1/whitelabel/config

Response:
{
  "branding": {
    "logo_url": "...",
    "primary_color": "#2563EB",
    "app_name": "RackPlane"
  },
  "terminology": {
    "asset": "Asset",
    "datacenter": "Datacenter",
    ...
  },
  "features": {
    "power_efficiency": true,
    "rack_visualization": true,
    ...
  },
  "vertical_pack": "datacenter"
}
```

---

## Training Exercises

### Exercise 1: Update Branding

**Goal:** Change your organization's colors and logo.

1. Navigate to Settings → White-Label → Branding
2. Upload your company logo
3. Set primary color to your brand color
4. Change app name to "YourCompany Inventory"
5. Save changes
6. Verify by refreshing the page

### Exercise 2: Customize Terminology

**Goal:** Change asset terminology for your industry.

1. Navigate to Settings → White-Label → Terminology
2. Change "Asset" to "Equipment"
3. Change "Datacenter" to "Facility"
4. Save changes
5. Navigate to Assets page
6. Verify terminology is updated

### Exercise 3: Apply a Vertical Pack

**Goal:** Switch to a different vertical configuration.

1. Navigate to Settings → White-Label → Vertical Pack
2. View available presets
3. Apply the "Warehouse" preset
4. Choose to reset terminology
5. Verify:
   - Terminology changed
   - Features adjusted
   - UI elements updated

### Exercise 4: API-Based Configuration

**Goal:** Update branding via API.

```bash
# 1. Get current config
curl -X GET http://localhost:8000/api/v1/whitelabel/config \
  -H "Authorization: Bearer YOUR_TOKEN"

# 2. Update primary color
curl -X PUT http://localhost:8000/api/v1/whitelabel/branding \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"primary_color": "#10B981"}'

# 3. Verify change
curl -X GET http://localhost:8000/api/v1/whitelabel/branding \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Best Practices

### 1. Start with a Vertical Pack

If you're in a specific industry, start by applying the relevant vertical pack. Then customize from there.

### 2. Test Changes Thoroughly

After changing terminology:
- Check all pages for consistency
- Verify search still works
- Test exports and reports

### 3. Document Custom Terms

Keep a reference of your custom terminology for:
- Training new users
- Documentation updates
- Support communications

### 4. Use Consistent Branding

Ensure colors and logo match your organization's brand guidelines.

### 5. Consider User Familiarity

When changing terminology, balance industry standards with user familiarity. Dramatic changes may require additional training.

---

## Troubleshooting

### "Terminology not updating"

- Clear browser cache
- Refresh the page
- Verify API response shows updated values

### "Logo not displaying"

- Check URL is publicly accessible
- Verify image format (PNG, SVG)
- Check file size (< 5MB)

### "Features still visible after disabling"

- Refresh the page
- Log out and log back in
- Check that save was successful

### "Cannot apply preset"

- Verify admin role
- Check current subscription tier
- Some presets may require higher tiers

---

## Next Steps

- [Multi-Tenant Onboarding](../guides/MULTI_TENANT_ONBOARDING.md)
- [Asset Management](ASSET_MANAGEMENT.md)
- [User Management](USER_MANAGEMENT.md)
- [API Documentation](../api/API_REFERENCE.md)
