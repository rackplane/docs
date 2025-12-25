# Database Backup & Restore Guide

## Overview

The DCMS application includes comprehensive backup and restore functionality to protect your data. This guide covers all backup methods: Web UI, API, and CLI.

## 🌐 Web UI Backup

### Accessing the Backup Page

  1. Navigate to the **Backup** page in the navigation menu
  2. View current database statistics
  3. Export or import backups with a few clicks



### Export Database

  1. Click the **"Download Backup"** button
  2. A JSON file will be downloaded with timestamp: `datacenter-backup-YYYY-MM-DD.json`
  3. Store this file in a safe location



### Import Database

  1. Click **"Select Backup File"** and choose a `.json` backup file
  2. The system will automatically validate the backup
  3. **Optional** : Check "Delete all existing data" to replace the entire database (⚠️ DANGEROUS!)
  4. Click **"Import Backup"**
  5. Review the import results



## 🔧 CLI Backup

### Export Database
    
    
    # Export with auto-generated filename
    cd backend
    python backup_cli.py export
    
    # Export with custom filename
    python backup_cli.py export --output my_backup.json
    

### Import Database
    
    
    # Import (adds to existing data)
    python backup_cli.py import my_backup.json
    
    # Import (replaces all data - WARNING!)
    python backup_cli.py import my_backup.json --clear
    

### View Database Summary
    
    
    python backup_cli.py summary
    

## 📡 API Endpoints

### Export Database
    
    
    GET /api/v1/backup/export
    

Downloads complete database as JSON.
    
    
    curl -o backup.json http://localhost:8000/api/v1/backup/export
    

### Import Database
    
    
    POST /api/v1/backup/import?clear_existing=false
    Content-Type: multipart/form-data
    

Upload a backup file to import.
    
    
    curl -X POST \
      -F "file=@backup.json" \
      http://localhost:8000/api/v1/backup/import
    

### Validate Backup
    
    
    POST /api/v1/backup/validate
    

Validate a backup file without importing.
    
    
    curl -X POST \
      -F "file=@backup.json" \
      http://localhost:8000/api/v1/backup/validate
    

### Get Database Summary
    
    
    GET /api/v1/backup/summary
    

Get current database statistics.
    
    
    curl http://localhost:8000/api/v1/backup/summary
    

## ⏰ Automated Backups with Cron

### Daily Backup at 2 AM

Add to your crontab (`crontab -e`):
    
    
    # Daily backup at 2 AM
    0 2 * * * cd /path/to/dcms/backend && python backup_cli.py export --output /backups/daily/backup_$(date +\%Y\%m\%d).json
    
    # Weekly backup on Sundays at 3 AM
    0 3 * * 0 cd /path/to/dcms/backend && python backup_cli.py export --output /backups/weekly/backup_$(date +\%Y\%m\%d).json
    
    # Monthly backup on the 1st at 4 AM
    0 4 1 * * cd /path/to/dcms/backend && python backup_cli.py export --output /backups/monthly/backup_$(date +\%Y\%m\%d).json
    

### Backup Rotation Script

Create `/backups/rotate_backups.sh`:
    
    
    #!/bin/bash
    # Keep last 7 daily backups
    find /backups/daily -name "*.json" -mtime +7 -delete
    
    # Keep last 4 weekly backups
    find /backups/weekly -name "*.json" -mtime +28 -delete
    
    # Keep last 12 monthly backups
    find /backups/monthly -name "*.json" -mtime +365 -delete
    

Add to crontab to run daily:
    
    
    0 5 * * * /backups/rotate_backups.sh
    

## 🐳 Docker Backup

### Export from Docker Container
    
    
    # Export database
    docker-compose exec backend python backup_cli.py export
    
    # Copy backup file from container to host
    docker cp dcms-backend:/app/dcms_backup_*.json ./backups/
    

### Import to Docker Container
    
    
    # Copy backup file from host to container
    docker cp ./backups/backup.json dcms-backend:/app/
    
    # Import database
    docker-compose exec backend python backup_cli.py import /app/backup.json
    

## 💾 Backup Storage Recommendations

### Local Storage

  * Store in `/backups` directory outside of application folder
  * Use different physical drives/partitions when possible
  * Regular filesystem backups (e.g., Time Machine, rsync)



### Cloud Storage

  * AWS S3
  * Google Cloud Storage
  * Azure Blob Storage
  * Dropbox/Google Drive for smaller deployments



### Example: Upload to AWS S3
    
    
    #!/bin/bash
    # backup_to_s3.sh
    BACKUP_FILE=$(python backup_cli.py export --output /tmp/backup_$(date +%Y%m%d_%H%M%S).json | grep "File:" | awk '{print $2}')
    aws s3 cp $BACKUP_FILE s3://my-bucket/datacenter-backups/
    rm $BACKUP_FILE
    

## 🔒 Security Considerations

  1. **Encrypt Backups** : Backup files contain sensitive data


    
    
       # Encrypt backup
       gpg --symmetric --cipher-algo AES256 backup.json
    
       # Decrypt backup
       gpg --decrypt backup.json.gpg > backup.json
       

  1. **Access Control** : Limit who can access backup files
  2. **Secure Transfer** : Use HTTPS/SFTP when transferring backups
  3. **Audit Logs** : Track who exports/imports backups



## 📋 Best Practices

### ✅ DO

  * ✅ Create regular automated backups (daily recommended)
  * ✅ Store backups in multiple locations (local + cloud)
  * ✅ Test restore process periodically (monthly)
  * ✅ Label backups with dates and descriptions
  * ✅ Keep 3-2-1 backup strategy (3 copies, 2 media types, 1 offsite)
  * ✅ Encrypt backups containing sensitive data
  * ✅ Document your backup procedures



### ❌ DON'T

  * ❌ Store backups only on the same server as the database
  * ❌ Use "Clear existing data" on production without testing first
  * ❌ Ignore backup errors and warnings
  * ❌ Keep backups indefinitely (implement rotation)
  * ❌ Share backup files over insecure channels
  * ❌ Forget to verify backups can be restored



## 🔄 Disaster Recovery Steps

### Complete Data Loss

  1. **Install Application** : Set up DCMS on a new server
  2. **Locate Latest Backup** : Find your most recent backup file
  3. **Restore Database** :


    
    
       python backup_cli.py import backup.json --clear
       

  1. **Verify Data** : Check that all records are present
  2. **Resume Operations** : Application is ready to use



### Partial Data Corruption

  1. **Export Current State** : Create backup of current (corrupted) state


    
    
       python backup_cli.py export --output corrupted_backup.json
       

  1. **Import Clean Backup** : Import a known-good backup (without --clear to add data)


    
    
       python backup_cli.py import good_backup.json
       

  1. **Manual Cleanup** : Remove duplicate or corrupted records via Web UI



### Testing Recovery

Regularly test your backups:
    
    
    # 1. Export current database
    python backup_cli.py export --output prod_backup.json
    
    # 2. Create test database (modify database connection in .env)
    # 3. Import to test database
    python backup_cli.py import prod_backup.json --clear
    
    # 4. Verify all data is present
    python backup_cli.py summary
    
    # 5. Test application functionality
    

## 📊 Backup File Structure
    
    
    {
      "metadata": {
        "backup_date": "2025-11-16T12:00:00Z",
        "version": "1.0",
        "description": "Full database backup",
        "exported_by": "CLI|API",
        "export_timestamp": "2025-11-16T12:00:00Z"
      },
      "tables": {
        "asset_types": {
          "count": 15,
          "columns": ["id", "name", "display_name", ...],
          "data": [...]
        },
        "datacenters": {
          "count": 3,
          "columns": ["id", "name", "code", ...],
          "data": [...]
        },
        ...
      }
    }
    

## 🆘 Troubleshooting

### Import Fails with Foreign Key Errors

**Solution** : Tables are imported in correct order. Ensure backup file is valid:
    
    
    python backup_cli.py validate backup.json
    

### Large Backup File Size

**Solution** :

  * Compress backups: `gzip backup.json`
  * Clean old lifecycle events and maintenance records
  * Implement data archiving strategy



### Slow Export/Import

**Solution** :

  * Normal for large databases (10k+ records)
  * Run during off-peak hours
  * Consider database-level backup for very large datasets



### Permission Errors

**Solution** :
    
    
    # Ensure proper permissions
    chmod +x backend/backup_cli.py
    chown -R user:user /backups
    

## 📞 Support

For backup-related issues:

  1. Check application logs in `backend/logs/`
  2. Review backup validation errors
  3. Consult this guide
  4. Contact system administrator



* * *

**Remember** : The best backup is the one you can successfully restore! Test your backups regularly.
