# Version: 1.0.0

# RackPlane

**Multi-Tenant SaaS Platform for Datacenter Hardware and Inventory Management**

## Overview

RackPlane is a comprehensive, real-time management platform for all physical assets within complex, multi-site datacenter environments. Built with modern technologies, it provides complete lifecycle tracking, predictive maintenance, capacity management, and workflow automation.

**Key Features:**
- **Multi-tenant SaaS architecture** - Built for multiple organizations from day one
- Real-time inventory tracking with barcode/QR code scanning
- **Stock management** with automatic storage box assignment
- Location & capacity management (datacenter → room → rack → U-position)
- **Label printing** with Brother PT-E550W support
- **Cable scanning and connection tracking**
- Predictive maintenance and workflow automation
- Environmental monitoring integration
- NetBox IPAM/DCIM synchronization
- Comprehensive reporting and compliance

## Key Features

### 1. Multi-Tenant SaaS Architecture
- **Shared Database, Shared Schema** - Cost-effective multi-tenancy
- Complete data isolation between tenants
- Tenant-scoped queries and access control
- Super admin capabilities for tenant management
- Automatic tenant context from JWT tokens

### 2. Real-Time Inventory Tracking
- Centralized asset database with complete lifecycle management
- Support for all hardware types (servers, switches, storage, network equipment, PDUs, cables, etc.)
- Barcode/QR code scanning integration
- Photo documentation with mobile upload support
- Real-time sync with NetBox IPAM/DCIM
- Custom asset types and fields

### 3. Stock Management & Storage Boxes
- **Automatic assignment** - Items automatically assigned to storage boxes on creation
- **Storage box tracking** - Track inventory levels in storage containers
- **Low stock alerts** - Automatic notifications when stock drops below threshold
- **Bulk assignment** - Assign multiple items to storage boxes via API or script
- **Lifecycle management** - Automatic status changes when items are deployed
- **Stock summaries** - View items by type, location, and container

### 4. Location & Capacity Management
- Precise asset location tracking (datacenter → room → rack → U-position)
- Real-time capacity monitoring:
  - **Space**: U-position utilization
  - **Power**: kW consumption and capacity
  - **Cooling**: BTU/hr requirements
- Intelligent placement suggestions based on available resources
- Visual rack elevation diagrams
- Storage container location tracking

### 5. Cable Management
- **Cable scanning** - Scan and track cable connections
- **Connection tracking** - Track what's connected to what
- **Automatic deployment** - Cables automatically removed from storage when deployed
- **Cable types** - Support for DAC, fiber, ethernet, power cables
- **Storage organization** - Automatic grouping by cable specifications

### 6. Label Printing
- **Brother PT-E550W support** - Optimized for network label printers
- **QR code labels** - Every label includes scannable QR code
- **Multiple label sizes** - 12mm, 24mm, 36mm tape support
- **Asset labels** - Print labels for any asset type
- **Storage container labels** - Label boxes and bins
- **Browser-based printing** - Works immediately without drivers

### 7. Predictive Maintenance *
- AI-powered failure prediction
- Historical pattern analysis
- Proactive maintenance scheduling
- MTTR (Mean Time To Repair) tracking
- Parts inventory management

### 8. Workflow Automation *
- Standard Operating Procedures (SOPs) automation
- MACs (Moves, Adds, Changes) workflows
- Deployment workflows
- Decommissioning workflows
- Custom workflow creation

### 9. Environmental Monitoring *
- Temperature and humidity tracking
- Integration with environmental sensors (SNMP, Modbus, HTTP)
- Threshold-based alerting
- Environmental compliance reporting
- Asset-environment correlation analysis

### 10. Reporting & Compliance
- Asset utilization reports
- Capacity planning reports
- Power Usage Effectiveness (PUE) analysis *
- Financial reports (depreciation, inventory value)
- Audit trails and compliance documentation
- Export to Excel, CSV, PDF
- Stock level reports
- Low stock alerts

### 11. NetBox Integration
- Automatic device import
- Rack and site synchronization
- IP address management integration

* Road Map or early access features
