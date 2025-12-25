# Multi-Tenant Onboarding Guide

## Overview

RackPlane uses a **multi-tenant SaaS architecture** where multiple organizations (tenants) share the same application instance while maintaining complete data isolation. This guide covers the complete tenant onboarding process from initial signup to full operational use.

---

## Table of Contents

1. [Understanding Multi-Tenancy](#understanding-multi-tenancy)
2. [Tenant Onboarding Flow](#tenant-onboarding-flow)
3. [Self-Service Onboarding](#self-service-onboarding)
4. [Admin-Assisted Onboarding](#admin-assisted-onboarding)
5. [Post-Onboarding Setup](#post-onboarding-setup)
6. [White-Label Configuration](#white-label-configuration)
7. [User Management](#user-management)
8. [Troubleshooting](#troubleshooting)

---

## Understanding Multi-Tenancy

### What is a Tenant?

A **tenant** represents an organization using RackPlane. Each tenant has:

- **Isolated Data**: All assets, users, locations, and configurations are completely separate
- **Unique Slug**: A URL-friendly identifier (e.g., `acme-corp`)
- **Subscription Tier**: Community, Starter, Pro, or MSP
- **Custom Branding**: Logo, colors, and terminology customization

### Tenant Isolation Model

RackPlane uses **Shared Database, Shared Schema** isolation:

```
┌─────────────────────────────────────────────────────────────┐
│                      RackPlane Platform                      │
├─────────────────────────────────────────────────────────────┤
│  Tenant A (Acme Corp)    │  Tenant B (DataFlow)             │
│  ├── Users               │  ├── Users                       │
│  ├── Assets              │  ├── Assets                      │
│  ├── Locations           │  ├── Locations                   │
│  └── Settings            │  └── Settings                    │
├─────────────────────────────────────────────────────────────┤
│              Shared PostgreSQL Database                      │
│              (tenant_id column on all tables)               │
└─────────────────────────────────────────────────────────────┘
```

**Key Security Features:**
- Every database query automatically filters by `tenant_id`
- JWT tokens carry tenant context
- Users can only access their own tenant's data
- Super admins can manage all tenants

---

## Tenant Onboarding Flow

### Quick Overview

```
┌──────────────┐    ┌───────────────┐    ┌─────────────────┐
│   Signup     │───►│ Tenant Setup  │───►│ First Login     │
│   Form       │    │ (Auto)        │    │                 │
└──────────────┘    └───────────────┘    └─────────────────┘
       │                    │                     │
       ▼                    ▼                     ▼
  • Company Name      • Tenant Created      • Change Password
  • Admin Email       • Admin User Created  • Configure Branding
  • Admin Password    • Default Asset Types • Add Users
  • Datacenter Info   • Datacenters Created • Import Assets
```

### What Gets Created Automatically

When a new tenant is onboarded, the system automatically creates:

1. **Tenant Record** - Organization metadata and settings
2. **Admin User** - First user with `TENANT_ADMIN` role
3. **Default Asset Types** - 21 pre-configured datacenter asset types:
   - Servers, Switches, Routers, Storage
   - Firewalls, Load Balancers, PDUs, UPS
   - Patch Panels, KVM Switches, Console Servers
   - Cables (DAC, Ethernet, Fiber, Electrical)
   - Transceivers (Copper, Optical)
   - NIC Cards, DPU Cards
4. **Datacenters** (if provided) - Initial location hierarchy
5. **Racks** (if provided) - Rack infrastructure
6. **JWT Access Token** - Immediate API access

---

## Self-Service Onboarding

### API Endpoint

**POST** `/api/v1/tenants/onboard`

This public endpoint allows new organizations to self-register.

### Required Information

```json
{
  "company_name": "Acme Corporation",
  "company_slug": "acme-corp",           // Optional, auto-generated if not provided
  "admin_username": "admin",
  "admin_email": "admin@acme.com",
  "admin_password": "SecurePassword123!",
  "subscription_tier": "community",       // community, starter, pro, msp
  "contact_email": "support@acme.com",    // Optional
  "contact_phone": "+1-555-0100",         // Optional
  "datacenters": [                        // Optional initial setup
    {
      "name": "Primary Datacenter",
      "code": "DC1",
      "address": "123 Tech Park",
      "city": "San Francisco",
      "state": "CA",
      "country": "USA"
    }
  ],
  "racks": [                              // Optional initial racks
    {
      "name": "Rack A01",
      "code": "A01",
      "datacenter_code": "DC1",
      "height_u": 42,
      "row": "A",
      "position": 1
    }
  ]
}
```

### Response

```json
{
  "tenant_id": 42,
  "tenant_name": "Acme Corporation",
  "tenant_slug": "acme-corp",
  "user_id": 123,
  "username": "admin",
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "message": "Tenant 'Acme Corporation' and admin user 'admin' created successfully. Seeded 21 default asset types.",
  "datacenters": [
    {"code": "DC1", "id": 1, "name": "Primary Datacenter"}
  ],
  "racks": [
    {"code": "A01", "id": 1, "name": "Rack A01", "datacenter_id": 1}
  ]
}
```

### Slug Generation Rules

If `company_slug` is not provided, it's auto-generated:
- Converted to lowercase
- Spaces replaced with hyphens
- Special characters removed
- Example: "Acme Corporation" → "acme-corporation"

**Reserved Slugs** (cannot be used):
`www`, `api`, `mail`, `status`, `admin`, `support`, `help`, `docs`, `app`, `dashboard`, `login`, `signup`, `onboarding`

---

## Admin-Assisted Onboarding

### Super Admin Tenant Creation

Super admins can create tenants through the admin portal or API:

**POST** `/api/v1/tenants/`

```json
{
  "name": "Enterprise Client",
  "slug": "enterprise-client",
  "subscription_tier": "pro",
  "contact_email": "admin@enterprise.com",
  "contact_phone": "+1-555-0200"
}
```

**Note:** This creates only the tenant - users must be added separately.

### Adding Users to a Tenant

**POST** `/api/v1/users/`

```json
{
  "username": "john.doe",
  "password": "UserPassword123!",
  "tenant_id": 42,
  "role": "user"           // user, tenant_admin, super_admin
}
```

### User Roles

| Role | Description | Capabilities |
|------|-------------|--------------|
| `user` | Standard user | View and edit assets within tenant |
| `tenant_admin` | Tenant administrator | Manage users, settings, branding |
| `super_admin` | Platform administrator | Manage all tenants and system settings |

---

## Post-Onboarding Setup

### Recommended First Steps

#### 1. Change Admin Password

```bash
PUT /api/v1/users/me/password
{
  "current_password": "InitialPassword123!",
  "new_password": "NewSecurePassword456!"
}
```

#### 2. Configure Branding (Optional)

```bash
PUT /api/v1/whitelabel/branding
{
  "logo_url": "https://cdn.acme.com/logo.png",
  "primary_color": "#2563EB",
  "app_name": "Acme Asset Manager"
}
```

#### 3. Customize Terminology (Optional)

```bash
PUT /api/v1/whitelabel/terminology
{
  "asset": "Equipment",
  "datacenter": "Facility",
  "rack": "Cabinet"
}
```

#### 4. Add Team Members

```bash
POST /api/v1/users/
{
  "username": "jane.smith",
  "password": "TempPassword123!",
  "role": "user"
}
```

#### 5. Set Up Locations

```bash
# Create datacenter
POST /api/v1/locations/datacenters/
{
  "name": "East Coast DC",
  "code": "EC1",
  "city": "New York",
  "state": "NY",
  "country": "USA"
}

# Create racks
POST /api/v1/locations/racks/
{
  "name": "Rack B01",
  "code": "B01",
  "datacenter_id": 1,
  "height_u": 42
}
```

#### 6. Import Assets

Assets can be added via:
- **Manual Entry**: Through the UI or API
- **Bulk Import**: CSV upload
- **FS.com Import**: Upload invoices (Pro+)
- **Barcode Scanning**: Mobile scanning feature

---

## White-Label Configuration

### Available Customization

RackPlane supports extensive white-labeling for each tenant:

#### Branding Options

| Setting | Description | Example |
|---------|-------------|---------|
| `logo_url` | Custom logo image | `https://cdn.company.com/logo.png` |
| `favicon_url` | Browser favicon | `https://cdn.company.com/favicon.ico` |
| `primary_color` | Main accent color | `#2563EB` |
| `secondary_color` | Secondary color | `#1E40AF` |
| `app_name` | Custom application name | `"DataFlow Manager"` |

#### Terminology Customization

Map standard terms to industry-specific terminology:

| Standard Term | Healthcare Example | Warehouse Example |
|--------------|-------------------|-------------------|
| Asset | Medical Device | Inventory Item |
| Datacenter | Medical Facility | Distribution Center |
| Rack | Storage Unit | Aisle |
| Container | Supply Cart | Pick Bin |

#### Vertical Pack Presets

Pre-configured setups for different industries:

1. **Datacenter** (Default)
   - Power efficiency features
   - Rack visualization
   - Network port management

2. **Healthcare**
   - Compliance tracking
   - Device sterilization tracking
   - Lot/batch number support

3. **Warehouse**
   - Bin location management
   - Inventory counts
   - Pick/pack workflows

---

## User Management

### Inviting Users

Tenant admins can invite new users:

```bash
POST /api/v1/users/invite
{
  "email": "newuser@company.com",
  "role": "user"
}
```

### Managing User Roles

```bash
PUT /api/v1/users/{user_id}
{
  "role": "tenant_admin"
}
```

### Deactivating Users

```bash
PUT /api/v1/users/{user_id}
{
  "is_active": false
}
```

---

## Troubleshooting

### Common Issues

#### "Slug already exists"

**Problem:** The company name generates a slug that's already taken.

**Solution:** Provide a custom `company_slug` in the onboarding request.

#### "Username already exists"

**Problem:** The admin username is already registered.

**Solution:** Choose a different username. Consider using email-style usernames (e.g., `admin@company.com`).

#### "Tenant limit reached"

**Problem:** Your license doesn't allow additional tenants.

**Solution:** Contact sales@rackplane.com to upgrade your MSP license.

#### "Invalid subscription tier"

**Problem:** Unknown subscription tier specified.

**Solution:** Use one of: `community`, `starter`, `pro`, `msp`

### Getting Help

- **Documentation**: Check `/api/docs` for full API reference
- **Support**: support@rackplane.com
- **GitHub Issues**: For bug reports and feature requests

---

## API Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/tenants/onboard` | POST | Self-service tenant registration |
| `/api/v1/tenants/` | POST | Admin tenant creation |
| `/api/v1/tenants/` | GET | List all tenants (super admin) |
| `/api/v1/tenants/{id}` | GET | Get tenant details |
| `/api/v1/tenants/{id}` | PUT | Update tenant |
| `/api/v1/tenants/current/settings` | GET | Get current tenant settings |
| `/api/v1/users/` | POST | Create user |
| `/api/v1/whitelabel/config` | GET | Get white-label config |
| `/api/v1/whitelabel/branding` | PUT | Update branding |
| `/api/v1/whitelabel/terminology` | PUT | Update terminology |

---

## Next Steps

After completing onboarding:

1. 📖 Read the [Getting Started Guide](GETTING_STARTED.md)
2. 🏢 Set up your [Location Hierarchy](LOCATION_SETUP.md)
3. 📦 Learn about [Asset Management](../training/ASSET_MANAGEMENT.md)
4. 🔌 Configure [Network Ports](../training/NETWORK_PORTS.md)
5. 🖨️ Set up [Label Printing](LABEL_PRINTING.md)
