# RackPlane Documentation

## Welcome to RackPlane Documentation

This documentation covers installation, configuration, and usage of RackPlane - a multi-tenant SaaS platform for inventory and asset management across multiple industries including datacenter, healthcare, and warehouse.

---

## Quick Links

| I want to... | Go to... |
|--------------|----------|
| Get started quickly | [Getting Started Guide](guides/GETTING_STARTED.md) |
| Set up a new organization | [Multi-Tenant Onboarding](guides/MULTI_TENANT_ONBOARDING.md) |
| Learn asset management | [Asset Management Training](training/ASSET_MANAGEMENT.md) |
| Customize branding | [White-Label Configuration](training/WHITE_LABEL.md) |
| Manage users and tenants | [Administrator Guide](training/ADMINISTRATOR_GUIDE.md) |
| Access the API | [API Reference](api/API_REFERENCE.md) |

---

## Documentation Structure

### 📚 Guides

Step-by-step guides for common tasks and setup procedures.

| Guide | Description |
|-------|-------------|
| [Getting Started](guides/GETTING_STARTED.md) | First login and basic orientation |
| [Multi-Tenant Onboarding](guides/MULTI_TENANT_ONBOARDING.md) | Complete tenant setup process |
| [Location Setup](guides/LOCATION_SETUP.md) | Datacenter, room, and rack configuration |
| [Label Printing](guides/LABEL_PRINTING.md) | Brother PT-E550W printer setup |

### 🎓 Training Materials

In-depth training for specific features and workflows.

| Training | Description |
|----------|-------------|
| [Asset Management](training/ASSET_MANAGEMENT.md) | Complete asset lifecycle management |
| [White-Label Configuration](training/WHITE_LABEL.md) | Branding and terminology customization |
| [Administrator Guide](training/ADMINISTRATOR_GUIDE.md) | Tenant and user management |
| [Network Ports](training/NETWORK_PORTS.md) | Port management and cable connections |
| [Reports](training/REPORTS.md) | Generating and exporting reports |

### 🏥 Industry Verticals

Specialized guides for different industry use cases.

| Vertical | Description |
|----------|-------------|
| [Healthcare Vertical](training/HEALTHCARE_VERTICAL.md) | Medical supply management, expiration tracking, lot numbers |
| [Warehouse Vertical](training/WAREHOUSE_VERTICAL.md) | Bin locations, pick/pack workflows, inventory counts |

### 🔌 API Reference

Technical documentation for API integration.

| Reference | Description |
|-----------|-------------|
| [API Overview](api/API_REFERENCE.md) | Authentication and common patterns |
| [Assets API](api/ASSETS_API.md) | Asset CRUD operations |
| [Locations API](api/LOCATIONS_API.md) | Location management |
| [Users API](api/USERS_API.md) | User management |
| [Version API](api/VERSION_API.md) | API versioning endpoints |

---

## By Role

### For New Users
1. [Getting Started](guides/GETTING_STARTED.md) - Orientation and first steps
2. [Asset Management](training/ASSET_MANAGEMENT.md) - Core functionality

### For Tenant Administrators
1. [Administrator Guide](training/ADMINISTRATOR_GUIDE.md) - User management
2. [White-Label Configuration](training/WHITE_LABEL.md) - Customization
3. [Multi-Tenant Onboarding](guides/MULTI_TENANT_ONBOARDING.md) - Adding organizations

### For Developers
1. [API Reference](api/API_REFERENCE.md) - REST API documentation
2. [Integration Guide](../backend/INTEGRATION_GUIDE.md) - Third-party integrations
3. [Development Setup](../DEV_SETUP.md) - Local development environment

### For Super Administrators
1. [Administrator Guide](training/ADMINISTRATOR_GUIDE.md) - Platform management
2. [Multi-Tenant Onboarding](guides/MULTI_TENANT_ONBOARDING.md) - Tenant provisioning
3. [Security Guide](guides/SECURITY.md) - Security best practices

---

## Feature Documentation

### Core Features
- **Multi-Tenant Architecture** - Complete tenant isolation
- **Asset Management** - Full lifecycle tracking
- **Location Hierarchy** - Datacenter → Room → Rack → U-position
- **Stock Management** - Spare parts and inventory

### Advanced Features
- **Network Ports** - Port-to-port cable connections
- **Label Printing** - QR code asset labels
- **OCR Scanning** - Label and invoice parsing
- **NetBox Integration** - Bidirectional sync (Pro+)

### White-Label Features
- **Branding** - Logo, colors, app name
- **Terminology** - Industry-specific language
- **Vertical Packs** - Pre-configured industry settings
- **Feature Toggles** - Enable/disable capabilities

### Industry Verticals
- **Datacenter** - Rack management, power efficiency, network ports
- **Healthcare** - Expiration tracking, lot numbers, FEFO, compliance
- **Warehouse** - Bin locations, pick/pack, inventory counts

---

## Subscription Tiers

| Feature | Community | Starter | Pro | MSP |
|---------|-----------|---------|-----|-----|
| Asset Management | ✅ | ✅ | ✅ | ✅ |
| Label Printing | ❌ | ✅ | ✅ | ✅ |
| Cloud OCR | ❌ | 100/mo | 500/mo | ∞ |
| API Access | ❌ | ❌ | ✅ | ✅ |
| NetBox Sync | ❌ | ❌ | ✅ | ✅ |
| Multi-Tenant | ❌ | ❌ | ❌ | ✅ |
| White-Label | ❌ | ❌ | ❌ | ✅ |

---

## Getting Help

### In-App Help
- Contextual help icons throughout the application
- Tooltips on hover
- Guided tours for new users

### Support Channels
- **Documentation**: You are here!
- **Email**: support@rackplane.com
- **GitHub**: [Issues](https://github.com/rackplane/rackplane/issues) and [Discussions](https://github.com/rackplane/rackplane/discussions)

### API Documentation
- **Swagger UI**: `/api/docs` on your installation
- **ReDoc**: `/api/redoc` for alternative view

---

## Version Information

| Component | Version |
|-----------|---------|
| API Version | v1.0.0 |
| Supported Versions | v1 |
| Documentation Updated | December 2024 |

Check `/api/version` for current API version information.

---

## Contributing to Documentation

We welcome contributions to improve this documentation:

1. Fork the repository
2. Edit documentation files in `/docs`
3. Submit a pull request

Please follow:
- Markdown formatting standards
- Clear, concise language
- Include examples where helpful
- Keep navigation links updated
