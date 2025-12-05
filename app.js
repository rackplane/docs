// Documentation Site JavaScript
const searchIndex = [{"title": "RackPlane Documentation", "file": "README.html", "category": "Getting Started"}, {"title": "Deployment Guide", "file": "DEPLOYMENT.html", "category": "Setup & Installation"}, {"title": "NetBox Integration Setup Guide", "file": "NETBOX_SETUP.html", "category": "Setup & Installation"}, {"title": "Label Printing Guide", "file": "LABEL_PRINTING.html", "category": "Setup & Installation"}, {"title": "\ud83d\udea8 QUICK FIX: Database \"dcms\" Does Not Exist", "file": "QUICK_FIX.html", "category": "Setup & Installation"}, {"title": "Stock Management Guide", "file": "STOCK_MANAGEMENT_GUIDE.html", "category": "User Guides"}, {"title": "Tenant Onboarding Documentation", "file": "TENANT_ONBOARDING.html", "category": "User Guides"}, {"title": "Database Backup & Restore Guide", "file": "BACKUP_GUIDE.html", "category": "Backup & Recovery"}, {"title": "Cross-Server Backup & Restore Guide", "file": "CROSS_SERVER_BACKUP.html", "category": "Backup & Recovery"}, {"title": "\ud83d\udea8 EMERGENCY DATABASE RECOVERY GUIDE", "file": "EMERGENCY_RECOVERY.html", "category": "Backup & Recovery"}, {"title": "API Documentation", "file": "API_DOCUMENTATION.html", "category": "API Reference"}];

// Search functionality
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            searchResults.classList.remove('show');
            return;
        }
        
        const results = searchIndex.filter(item => {
            return item.title.toLowerCase().includes(query) ||
                   item.category.toLowerCase().includes(query);
        }).slice(0, 10);
        
        if (results.length > 0) {
            searchResults.innerHTML = results.map(item => `
                <div class="search-result-item" onclick="window.location.href='${item.file}'">
                    <div class="search-result-title">${item.title}</div>
                    <div class="search-result-path">${item.category}</div>
                </div>
            `).join('');
            searchResults.classList.add('show');
        } else {
            searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
            searchResults.classList.add('show');
        }
    });
    
    // Close search on click outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('show');
        }
    });
}

// Mobile sidebar toggle
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Highlight code blocks (optional enhancement)
document.querySelectorAll('pre code').forEach(block => {
    // Could add syntax highlighting here with a library like Prism.js
});
