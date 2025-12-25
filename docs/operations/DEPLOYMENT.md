# Deployment Guide

## Deployment Options

### 1\. Docker Compose (Recommended for Development/Small Scale)

#### Prerequisites

  * Docker 20.10+
  * Docker Compose 2.0+
  * 4GB RAM minimum
  * 20GB disk space



#### Steps

  1. **Clone and configure**


    
    
    git clone <repository-url>
    cd dcms
    cp env.example .env
    

  1. **Edit configuration**


    
    
    nano .env
    # CRITICAL: Update these security settings:
    #   - SECRET_KEY: Generate a secure random key (openssl rand -hex 32)
    #   - CORS_ORIGINS: Configure for your setup (see below)
    #   - DATABASE_URL: Update with secure password
    #   - NETBOX credentials: If using NetBox integration
    #
    # CORS Configuration:
    #   - Development: ["http://localhost:3000", "http://127.0.0.1:3000"]
    #   - With reverse proxy: Add your proxy origin (e.g., "https://dcms.example.com")
    #   - Docker network: Add container hostnames if accessing from other containers
    #   - IP access: Add IP origins (e.g., "http://192.168.1.100:3000")
    

  1. **Start services**


    
    
    docker-compose up -d
    

  1. **Initialize database**


    
    
    docker-compose exec backend python -c "from app.core.database import engine, Base; Base.metadata.create_all(bind=engine)"
    

  1. **Verify deployment**


    
    
    docker-compose ps
    curl http://localhost:8000/health
    

#### Service URLs

  * Frontend: http://localhost:3000
  * Backend API: http://localhost:8000
  * API Docs: http://localhost:8000/api/docs
  * PostgreSQL: localhost:5432
  * Redis: localhost:6379
  * MinIO Console: http://localhost:9001



### 2\. Production Deployment (Docker + External Services)

#### Architecture
    
    
    [Load Balancer]
        ├── Frontend (React) x3 replicas
        ├── Backend (FastAPI) x3 replicas
        └── Celery Workers x2 replicas
    
    [External Services]
        ├── PostgreSQL (RDS/Managed)
        ├── Redis (ElastiCache/Managed)
        └── S3/MinIO (Object Storage)
    

#### Prerequisites

  * Production PostgreSQL instance
  * Production Redis instance
  * S3 or MinIO for object storage
  * SSL certificates
  * Domain name



#### Configuration

**1\. Database Setup**
    
    
    CREATE DATABASE datacenter_inventory;
    CREATE USER dcms_app WITH PASSWORD 'secure_password';
    GRANT ALL PRIVILEGES ON DATABASE datacenter_inventory TO dcms_app;
    

**2\. Environment Configuration**
    
    
    # Production .env
    DATABASE_URL=postgresql://dcms_app:secure_password@prod-db.example.com:5432/datacenter_inventory
    REDIS_URL=redis://prod-redis.example.com:6379/0
    
    # SECURITY: Generate secure random key
    # Generate: openssl rand -hex 32
    SECRET_KEY=<generate-secure-random-key>
    DEBUG=False
    
    # CORS Configuration - CRITICAL for production!
    # Must include all origins that will access the API:
    #   - Frontend domain (if different from API)
    #   - Reverse proxy origin (if using nginx/traefik/etc.)
    #   - Any other allowed origins
    # Example with reverse proxy:
    CORS_ORIGINS=["https://dcms.example.com", "https://app.example.com"]
    
    # NetBox
    NETBOX_URL=https://netbox.example.com
    NETBOX_TOKEN=<your-netbox-token>
    

**3\. Build and Deploy**
    
    
    # Build production images
    docker build -t dcms-backend:latest ./backend
    docker build -t dcms-frontend:latest ./frontend
    
    # Push to registry
    docker tag dcms-backend:latest registry.example.com/dcms-backend:latest
    docker push registry.example.com/dcms-backend:latest
    
    # Deploy
    docker run -d \
      --name dcms-backend \
      --env-file .env.production \
      -p 8000:8000 \
      registry.example.com/dcms-backend:latest
    

### 3\. Kubernetes Deployment

#### Prerequisites

  * Kubernetes cluster (1.24+)
  * kubectl configured
  * Helm 3 (optional)



#### Deployment Steps

**1\. Create namespace**
    
    
    kubectl create namespace dcms
    

**2\. Create secrets**
    
    
    kubectl create secret generic dcms-secrets \
      --from-literal=database-url='postgresql://user:pass@host:5432/db' \
      --from-literal=secret-key='your-secret-key' \
      --from-literal=netbox-token='your-netbox-token' \
      -n dcms
    

**3\. Deploy PostgreSQL (if not using external)**
    
    
    # Create PVC
    kubectl apply -f k8s/postgres-pvc.yaml -n dcms
    
    # Deploy PostgreSQL
    kubectl apply -f k8s/postgres-deployment.yaml -n dcms
    kubectl apply -f k8s/postgres-service.yaml -n dcms
    

**4\. Deploy Redis**
    
    
    kubectl apply -f k8s/redis-deployment.yaml -n dcms
    kubectl apply -f k8s/redis-service.yaml -n dcms
    

**5\. Deploy Backend**
    
    
    kubectl apply -f k8s/backend-deployment.yaml -n dcms
    kubectl apply -f k8s/backend-service.yaml -n dcms
    

**6\. Deploy Frontend**
    
    
    kubectl apply -f k8s/frontend-deployment.yaml -n dcms
    kubectl apply -f k8s/frontend-service.yaml -n dcms
    

**7\. Configure Ingress**
    
    
    kubectl apply -f k8s/ingress.yaml -n dcms
    

**8\. Verify deployment**
    
    
    kubectl get pods -n dcms
    kubectl get services -n dcms
    kubectl get ingress -n dcms
    

### 4\. Cloud-Specific Deployments

#### AWS Deployment

**Services Used:**

  * ECS/EKS for container orchestration
  * RDS PostgreSQL
  * ElastiCache Redis
  * S3 for object storage
  * ALB for load balancing
  * Route53 for DNS



**Architecture:**
    
    
    Route53 → ALB → ECS/EKS
                  ├── Frontend Tasks
                  ├── Backend Tasks
                  └── Celery Workers
    
    External Services:
    ├── RDS PostgreSQL
    ├── ElastiCache Redis
    └── S3
    

#### Azure Deployment

**Services Used:**

  * AKS for Kubernetes
  * Azure Database for PostgreSQL
  * Azure Cache for Redis
  * Azure Blob Storage
  * Application Gateway
  * Azure DNS



#### Google Cloud Deployment

**Services Used:**

  * GKE for Kubernetes
  * Cloud SQL PostgreSQL
  * Memorystore for Redis
  * Cloud Storage
  * Cloud Load Balancing
  * Cloud DNS



## Security Considerations

### 1\. Network Security
    
    
    # Firewall rules
    - Allow HTTPS (443) from internet to load balancer
    - Allow HTTP (80) redirected to HTTPS
    - Allow PostgreSQL (5432) only from backend
    - Allow Redis (6379) only from backend
    - Deny all other inbound traffic
    

### 2\. Application Security

  * Use strong SECRET_KEY (32+ random characters)
  * Configure CORS_ORIGINS for your deployment (especially if using reverse proxy)
  * Enable HTTPS/TLS for all connections
  * Implement rate limiting
  * Use prepared statements (SQLAlchemy handles this)
  * Validate all user inputs
  * Implement authentication/authorization
  * Regular security updates



### 3\. Database Security

  * Use strong database passwords
  * Enable SSL for database connections
  * Regular backups
  * Point-in-time recovery
  * Encryption at rest
  * Network isolation



### 4\. Secrets Management

  * Use environment variables
  * Never commit secrets to git
  * Use secrets managers (AWS Secrets Manager, HashiCorp Vault, etc.)
  * Rotate credentials regularly



## Monitoring & Logging

### Prometheus Metrics

Add prometheus metrics exporter:
    
    
    # In backend/requirements.txt
    prometheus-fastapi-instrumentator==6.1.0
    
    # In backend/app/main.py
    from prometheus_fastapi_instrumentator import Instrumentator
    
    Instrumentator().instrument(app).expose(app)
    

### Logging Configuration
    
    
    # backend/app/core/logging.py
    import logging
    import sys
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler('/var/log/dcms/app.log')
        ]
    )
    

### Health Checks
    
    
    # Backend health check
    curl http://localhost:8000/health
    
    # Database connectivity
    curl http://localhost:8000/health/db
    
    # Redis connectivity
    curl http://localhost:8000/health/redis
    

## Backup & Recovery

### Database Backup

**Automated backup script:**
    
    
    #!/bin/bash
    # backup-db.sh
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_DIR="/backups/postgres"
    
    docker-compose exec -T db pg_dump -U dcms datacenter_inventory | \
      gzip > "$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"
    
    # Retain only last 30 days
    find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +30 -delete
    

**Schedule with cron:**
    
    
    0 2 * * * /path/to/backup-db.sh
    

### Restore from Backup
    
    
    gunzip < backup_20240101_020000.sql.gz | \
      docker-compose exec -T db psql -U dcms datacenter_inventory
    

### File Storage Backup
    
    
    # Backup MinIO data
    docker-compose exec minio mc mirror \
      local/dcms-uploads \
      s3/backup-bucket/dcms-uploads-$(date +%Y%m%d)
    

## Scaling

### Horizontal Scaling

**Backend:**
    
    
    docker-compose up -d --scale backend=3
    

**Celery Workers:**
    
    
    docker-compose up -d --scale celery_worker=5
    

### Vertical Scaling

Update docker-compose.yml:
    
    
    services:
      backend:
        deploy:
          resources:
            limits:
              cpus: '2'
              memory: 4G
            reservations:
              cpus: '1'
              memory: 2G
    

## Performance Optimization

### Database Optimization
    
    
    -- Create indexes for frequently queried fields
    CREATE INDEX idx_assets_status ON assets(status);
    CREATE INDEX idx_assets_datacenter ON assets(datacenter_id);
    CREATE INDEX idx_assets_rack ON assets(rack_id);
    CREATE INDEX idx_assets_type ON assets(asset_type);
    

### Redis Caching

Implement caching for expensive queries:
    
    
    # In service methods
    cache_key = f"rack_capacity:{rack_id}"
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    # Calculate and cache
    result = calculate_capacity(rack_id)
    redis_client.setex(cache_key, 300, json.dumps(result))  # 5 min TTL
    return result
    

## Troubleshooting

### Common Issues

**1\. Database connection failed**
    
    
    # Check database is running
    docker-compose ps db
    
    # Check connection
    docker-compose exec backend psql $DATABASE_URL -c "SELECT 1"
    
    # Check logs
    docker-compose logs db
    

**2\. Frontend can't reach backend**
    
    
    # Check CORS settings (CRITICAL if using reverse proxy or accessing from IP)
    # If using a reverse proxy, ensure CORS_ORIGINS includes your proxy origin
    # Example: CORS_ORIGINS=["https://dcms.example.com", "http://localhost:3000"]
    # Verify REACT_APP_API_URL in frontend/.env
    # Check backend CORS_ORIGINS in .env (root directory for Docker)
    

**3\. High memory usage**
    
    
    # Check container stats
    docker stats
    
    # Limit memory
    docker-compose down
    # Edit docker-compose.yml to add memory limits
    docker-compose up -d
    

**4\. Slow API responses**
    
    
    # Check database query performance
    # Enable SQL logging in backend
    DEBUG_SQL=True
    
    # Check Celery queue backlog
    docker-compose exec redis redis-cli LLEN celery
    
    # Add database indexes
    

## Maintenance

### Regular Tasks

  * **Daily** : Check logs for errors
  * **Weekly** : Review capacity metrics
  * **Monthly** : Update dependencies
  * **Quarterly** : Security audit
  * **Annually** : Disaster recovery test



### Updates
    
    
    # Pull latest changes
    git pull origin main
    
    # Rebuild containers
    docker-compose build
    
    # Apply database migrations (if any)
    docker-compose exec backend alembic upgrade head
    
    # Restart services
    docker-compose down
    docker-compose up -d
    

* * *

For additional support, consult the main README.md or open an issue on GitHub.
