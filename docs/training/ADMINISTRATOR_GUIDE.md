# Administrator Training Guide

## Multi-Tenant Administration in RackPlane

This guide is for platform administrators (Super Admins) and tenant administrators who manage organizations and users.

---

## Table of Contents

1. [Understanding Admin Roles](#understanding-admin-roles)
2. [Tenant Management](#tenant-management)
3. [User Management](#user-management)
4. [Subscription Management](#subscription-management)
5. [Monitoring & Auditing](#monitoring--auditing)
6. [Troubleshooting](#troubleshooting)

---

## Understanding Admin Roles

### Role Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                      SUPER ADMIN                             │
│  • Manage all tenants                                        │
│  • Create/delete organizations                               │
│  • Access system settings                                    │
│  • View all audit logs                                       │
├─────────────────────────────────────────────────────────────┤
│                     TENANT ADMIN                             │
│  • Manage users within tenant                                │
│  • Configure white-label settings                            │
│  • View tenant audit logs                                    │
│  • Manage tenant settings                                    │
├─────────────────────────────────────────────────────────────┤
│                        USER                                  │
│  • View and edit assets                                      │
│  • Create reports                                            │
│  • Use scan features                                         │
└─────────────────────────────────────────────────────────────┘
```

### Role Permissions Matrix

| Action | User | Tenant Admin | Super Admin |
|--------|------|--------------|-------------|
| View assets | ✅ | ✅ | ✅ (all tenants) |
| Edit assets | ✅ | ✅ | ✅ (all tenants) |
| Create users | ❌ | ✅ | ✅ |
| Delete users | ❌ | ✅ | ✅ |
| Configure branding | ❌ | ✅ | ✅ |
| Manage tenants | ❌ | ❌ | ✅ |
| System settings | ❌ | ❌ | ✅ |
| View all audit logs | ❌ | Tenant only | ✅ |

---

## Tenant Management

### Viewing All Tenants

**Super Admin Only**

```bash
GET /api/v1/tenants/

Response:
{
  "tenants": [
    {
      "id": 1,
      "name": "Acme Corporation",
      "slug": "acme-corp",
      "is_active": true,
      "subscription_tier": "pro",
      "user_count": 15,
      "created_at": "2024-01-15T10:30:00Z"
    },
    ...
  ],
  "total": 25,
  "page": 1,
  "per_page": 20
}
```

### Creating a New Tenant

**Two Methods:**

#### 1. Self-Service Onboarding (Public)
```bash
POST /api/v1/tenants/onboard
# Creates tenant + admin user + default data
```

#### 2. Admin Creation (Super Admin)
```bash
POST /api/v1/tenants/
# Creates tenant only - users added separately
```

**Admin Creation Example:**
```json
{
  "name": "New Client Inc",
  "slug": "new-client",
  "subscription_tier": "starter",
  "contact_email": "admin@newclient.com",
  "contact_phone": "+1-555-0123"
}
```

### Updating Tenant Details

```bash
PUT /api/v1/tenants/{tenant_id}

{
  "name": "Updated Company Name",
  "subscription_tier": "pro",
  "is_active": true
}
```

### Deactivating a Tenant

```bash
PUT /api/v1/tenants/{tenant_id}

{
  "is_active": false
}
```

**Effects of Deactivation:**
- Users cannot log in
- API access is blocked
- Data remains intact (can be reactivated)

### Deleting a Tenant

```bash
DELETE /api/v1/tenants/{tenant_id}
```

**⚠️ Warning:** This permanently removes:
- All users
- All assets
- All locations
- All audit logs
- All settings

**Prerequisite:** Tenant must have no users or assets.

---

## User Management

### Viewing Users

**Tenant Admin:** See users in your tenant
```bash
GET /api/v1/users/
```

**Super Admin:** See all users or filter by tenant
```bash
GET /api/v1/users/?tenant_id=42
```

### Creating a User

```bash
POST /api/v1/users/

{
  "username": "jane.smith",
  "email": "jane.smith@company.com",
  "password": "TempPassword123!",
  "role": "user",
  "tenant_id": 42    // Super admin only - optional
}
```

### Updating User Role

```bash
PUT /api/v1/users/{user_id}

{
  "role": "tenant_admin"
}
```

**Available Roles:**
- `user` - Standard access
- `tenant_admin` - Tenant management access
- `super_admin` - Platform-wide access (Super Admin only)

### Password Reset

**User Self-Reset:**
```bash
POST /api/v1/auth/forgot-password
{
  "email": "user@company.com"
}
```

**Admin Reset:**
```bash
PUT /api/v1/users/{user_id}/reset-password
{
  "new_password": "NewTempPassword123!"
}
```

### Deactivating Users

```bash
PUT /api/v1/users/{user_id}

{
  "is_active": false
}
```

**⚠️ Never delete the last admin user in a tenant!**

### User Activity

View user's last activity:
```bash
GET /api/v1/users/{user_id}

Response includes:
{
  "last_login": "2024-12-20T14:30:00Z",
  "login_count": 45,
  "last_activity": "2024-12-20T16:45:00Z"
}
```

---

## Subscription Management

### Subscription Tiers

| Tier | Features | Price |
|------|----------|-------|
| **Community** | Basic asset management | Free |
| **Starter** | + Label printing, OCR (100/mo) | $49/mo |
| **Pro** | + NetBox, API, Unlimited users | $149/mo |
| **MSP** | + Multi-tenant, White-label | Custom |

### Updating Subscription

```bash
PUT /api/v1/tenants/{tenant_id}

{
  "subscription_tier": "pro"
}
```

### Feature Gating

Features are automatically gated based on subscription:

```python
# Backend automatically checks subscription
if not tenant.has_feature("label_printing"):
    raise HTTPException(403, "Upgrade to Starter for label printing")
```

### Checking Feature Access

```bash
GET /api/v1/tenants/current/features

Response:
{
  "label_printing": true,
  "cloud_ocr": true,
  "ocr_quota": 100,
  "ocr_used": 45,
  "netbox_sync": false,
  "api_access": false,
  ...
}
```

---

## Monitoring & Auditing

### Audit Logs

All actions are logged for compliance:

```bash
GET /api/v1/audit-logs/

Response:
{
  "logs": [
    {
      "id": 12345,
      "timestamp": "2024-12-20T14:30:00Z",
      "user_id": 42,
      "username": "jane.smith",
      "action": "UPDATE",
      "resource_type": "asset",
      "resource_id": 100,
      "changes": {
        "before": {"status": "storage"},
        "after": {"status": "active"}
      },
      "ip_address": "192.168.1.100"
    }
  ]
}
```

### Filtering Audit Logs

```bash
# By user
GET /api/v1/audit-logs/?user_id=42

# By action
GET /api/v1/audit-logs/?action=DELETE

# By resource
GET /api/v1/audit-logs/?resource_type=asset

# By date range
GET /api/v1/audit-logs/?start_date=2024-12-01&end_date=2024-12-31
```

### Tenant Health Dashboard

Super admins can monitor tenant health:

```bash
GET /api/v1/admin/dashboard

Response:
{
  "total_tenants": 50,
  "active_tenants": 48,
  "total_users": 500,
  "total_assets": 25000,
  "daily_active_users": 120,
  "api_calls_today": 5000,
  "storage_used_gb": 150,
  "tenants_by_tier": {
    "community": 20,
    "starter": 15,
    "pro": 10,
    "msp": 5
  }
}
```

---

## Tenant Settings

### Accessing Tenant Settings

```bash
GET /api/v1/tenants/current/settings

Response:
{
  "show_dev_troubleshooting": false,
  "enable_debug_logs": false,
  "rackplane_api_key_configured": true,
  "rackplane_cloud_connected": true
}
```

### Updating Tenant Settings

```bash
PUT /api/v1/tenants/current/settings

{
  "show_dev_troubleshooting": true,
  "enable_debug_logs": true,
  "rackplane_api_key": "rk_live_xxxxx"
}
```

### API Key Management

Each tenant can have an API key for cloud services:

```bash
PUT /api/v1/tenants/current/settings

{
  "rackplane_api_key": "rk_live_abc123def456"
}
```

This enables:
- Cloud OCR
- Vendor product search
- Global SKU catalog

---

## Troubleshooting

### User Can't Log In

**Checklist:**
1. Is the user active? (`is_active: true`)
2. Is the tenant active? (`is_active: true`)
3. Is the password correct? (Try reset)
4. Is the subscription valid?

**Force Password Reset:**
```bash
PUT /api/v1/users/{user_id}/reset-password
{
  "new_password": "NewPassword123!"
}
```

### Tenant Access Issues

**Symptoms:** Users can log in but can't see data

**Possible Causes:**
1. Tenant mismatch in JWT token
2. Cross-tenant data corruption
3. Role permissions incorrect

**Debug:**
```bash
# Check user's tenant
GET /api/v1/users/me

# Verify tenant context
GET /api/v1/tenants/current
```

### Missing Features

**Symptom:** Feature appears greyed out or hidden

**Check:**
1. Subscription tier includes feature?
2. Feature toggle enabled?
3. Vertical pack configuration?

```bash
# Check subscription features
GET /api/v1/tenants/current/features

# Check white-label features
GET /api/v1/whitelabel/features
```

### Quota Exceeded

**Symptom:** OCR or API returns quota error

```bash
GET /api/v1/tenants/current/quota

Response:
{
  "ocr_limit": 100,
  "ocr_used": 100,
  "ocr_remaining": 0,
  "resets_at": "2025-01-01T00:00:00Z"
}
```

**Solution:** Upgrade subscription or wait for quota reset.

---

## Security Best Practices

### 1. Enforce Strong Passwords

Requirements:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### 2. Regular User Audits

Monthly:
- Review inactive users (>30 days)
- Deactivate unused accounts
- Review tenant admin assignments

### 3. Monitor Audit Logs

Watch for:
- Failed login attempts
- Bulk deletions
- Permission changes
- Unusual activity patterns

### 4. API Key Rotation

Recommended:
- Rotate API keys every 90 days
- Never share keys via email
- Use environment variables

### 5. Principle of Least Privilege

- Assign minimum required role
- Only promote to admin when necessary
- Review permissions quarterly

---

## Common Admin Tasks

### Onboarding a New Client

1. Create tenant with appropriate tier
2. Send onboarding credentials securely
3. Verify login success
4. Configure initial settings
5. Provide training links

### Offboarding a Client

1. Export their data (if requested)
2. Deactivate all users
3. Deactivate tenant
4. Archive after retention period
5. Delete (if required)

### Handling Support Requests

1. Identify tenant context
2. Check audit logs for issues
3. Verify user permissions
4. Test in similar environment
5. Document resolution

---

## Admin API Quick Reference

| Action | Endpoint |
|--------|----------|
| List tenants | `GET /api/v1/tenants/` |
| Create tenant | `POST /api/v1/tenants/` |
| Update tenant | `PUT /api/v1/tenants/{id}` |
| Delete tenant | `DELETE /api/v1/tenants/{id}` |
| List users | `GET /api/v1/users/` |
| Create user | `POST /api/v1/users/` |
| Update user | `PUT /api/v1/users/{id}` |
| Reset password | `PUT /api/v1/users/{id}/reset-password` |
| View audit logs | `GET /api/v1/audit-logs/` |
| Tenant settings | `GET/PUT /api/v1/tenants/current/settings` |

---

## Next Steps

- [Multi-Tenant Onboarding](../guides/MULTI_TENANT_ONBOARDING.md)
- [White-Label Configuration](WHITE_LABEL.md)
- [API Reference](../api/API_REFERENCE.md)
- [Security Guide](../guides/SECURITY.md)
