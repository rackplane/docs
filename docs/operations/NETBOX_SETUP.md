# NetBox Integration Setup Guide

## Configuration Steps

### 1\. Get Your NetBox API Token

First, you need to obtain an API token from your NetBox instance:

  1. Log in to your NetBox web interface
  2. Go to your user profile (top right corner → Profile)
  3. Navigate to "API Tokens" section
  4. Click "Add a token" or "Create Token"
  5. Give it a name (e.g., "DCMS Integration")
  6. Copy the generated token



### 2\. Configure Environment Variables

#### Option A: Using Docker (Recommended)

Edit the `.env` file in the project root (`/home/user/dcms/.env`):
    
    
    # Replace with your actual values
    NETBOX_URL=https://netbox.yourcompany.com
    NETBOX_TOKEN=abc123def456your-actual-token-here
    

**Note:**

  * The URL should NOT have a trailing slash
  * The URL should include the protocol (https:// or http://)
  * Example: `https://netbox.example.com` or `http://192.168.1.100:8080`



#### Option B: Running Backend Directly (Without Docker)

Edit the `.env` file in the backend directory (`/home/user/dcms/backend/.env`):
    
    
    # Replace with your actual values
    NETBOX_URL=https://netbox.yourcompany.com
    NETBOX_TOKEN=abc123def456your-actual-token-here
    

### 3\. Restart Your Services

#### If using Docker:
    
    
    cd /home/user/dcms
    docker-compose down
    docker-compose up -d backend
    

#### If running backend directly:

Stop the backend process (Ctrl+C) and restart it:
    
    
    cd /home/user/dcms/backend
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
    

### 4\. Verify Configuration

After restarting, navigate to the NetBox page in the UI:
    
    
    http://localhost:3000/netbox
    

Click the "Test Connection" button. You should see:

  * ✓ Green status if connected successfully
  * The NetBox version number
  * Your NetBox URL



### 5\. Run Database Migration (if needed)

If you have an existing database, run this migration to add NetBox ID fields:
    
    
    cd /home/user/dcms/backend
    python add_netbox_id_columns.py
    

## Troubleshooting

### Issue: "NetBox URL or token not configured"

**Solution:** Make sure you've edited the `.env` file with your actual values and restarted the service.

### Issue: "Connection failed: Unable to connect"

**Possible causes:**

  1. **Wrong URL format** \- Make sure URL doesn't have trailing slash
  2. **Network issue** \- Can you access NetBox from your browser?
  3. **SSL certificate issue** \- If using self-signed certs, you may need additional configuration
  4. **Firewall** \- Ensure the backend container/process can reach NetBox



**Test from backend container:**
    
    
    # If using Docker
    docker exec -it rackplane_backend curl -H "Authorization: Token YOUR_TOKEN" https://your-netbox-url/api/
    
    # If running directly
    curl -H "Authorization: Token YOUR_TOKEN" https://your-netbox-url/api/
    

### Issue: "Unauthorized" or "Invalid token"

**Solution:**

  1. Verify your token is correct (copy-paste it again)
  2. Check that the token is active in NetBox
  3. Ensure the token has read permissions



### Issue: Environment variables not being read

**For Docker:**

  1. Make sure the `.env` file is in the same directory as `docker-compose.yml`
  2. Restart with: `docker-compose down && docker-compose up -d`
  3. Check if variables are set: `docker exec rackplane_backend env | grep NETBOX`



**For direct backend:**

  1. Make sure the `.env` file is in the `backend/` directory
  2. Restart the uvicorn process
  3. Check in Python:


    
    
       cd backend
       python -c "from app.core.config import settings; print(f'URL: {settings.NETBOX_URL}'); print(f'Token: {settings.NETBOX_TOKEN[:10]}...')"
       

## Example Configuration

Here's a complete example of what your `.env` should look like:
    
    
    # For a cloud-hosted NetBox
    NETBOX_URL=https://netbox.example.com
    NETBOX_TOKEN=0123456789abcdef0123456789abcdef01234567
    
    # For a local NetBox instance
    NETBOX_URL=http://192.168.1.100:8000
    NETBOX_TOKEN=0123456789abcdef0123456789abcdef01234567
    
    # For NetBox running in Docker on same machine
    NETBOX_URL=http://netbox:8080
    NETBOX_TOKEN=0123456789abcdef0123456789abcdef01234567
    

## Next Steps

Once connected successfully:

  1. **Import Racks** \- Click "Import Racks" to pull rack definitions from NetBox
  2. **Import Devices** \- Click "Import Devices" to pull device inventory
  3. **Full Sync** \- Use "Full Sync" to import everything at once



The system will automatically:

  * Create datacenters from NetBox sites
  * Create racks with proper dimensions
  * Create assets from devices
  * Map device roles to asset types
  * Maintain NetBox ID links for future syncs


