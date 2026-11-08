// =========================================
// UNRE LMS DEMO - CORE SCRIPTS
// =========================================

window.addEventListener('DOMContentLoaded', event => {

    // 1. Sidebar Toggle Logic (from sidebar.js)
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

    // 2. Scroll to Top Logic (from top-scroll.js)
    const mybutton = document.getElementById("scroll-btn");
    if (mybutton) {
        window.onscroll = function() {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                mybutton.style.display = "block";
            } else {
                mybutton.style.display = "none";
            }
        };
    }

    // 3. Mock Authentication / Session Guard
    // We only protect the dashboard (and subsequent inner pages)
    const protectedPages = ['dashboard.html', 'loans.html', 'customers.html', 'imports.html', 'users.html', 'logs.html', 'statement.html', 'my-transactions.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    const mockUser = sessionStorage.getItem('demo_user');

    // If trying to access a protected page without logging in
    if (protectedPages.includes(currentPage) && !mockUser) {
        window.location.href = 'login.html';
    }

    // If logged in, populate the Topbar and Sidebar user details
    if (mockUser) {
        const user = JSON.parse(mockUser);
        
        // Populate Topbar name
        const topbarName = document.getElementById('topbarUserName');
        if (topbarName) topbarName.innerText = user.name;

        // Populate Sidebar footer
        const sidebarName = document.getElementById('sidebarUserName');
        if (sidebarName) sidebarName.innerText = user.username;

        // Role-based Sidebar Rendering
        renderSidebar(user.role);
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('demo_user');
            window.location.href = 'login.html';
        });
    }
});

// Scroll to top function (referenced in HTML)
function topFunction() {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
}

// Mock Login Handler (to be called from index.html)
function handleMockLogin(event, roleType) {
    event.preventDefault();
    
    let username, name, role;

    if (roleType === 'staff') {
        const userInput = document.getElementById('username').value;
        // Mock logic: accept 'admin' or 'officer'
        if (userInput === 'admin') {
            username = 'admin';
            name = 'Super ADMINISTRATOR';
            role = 'admin';
        } else {
            username = 'nmoveh';
            name = 'MOVEH, Nerrie';
            role = 'officer';
        }
    } else {
        username = document.getElementById('customerID').value;
        name = 'WATSON, James';
        role = 'customer';
    }

    // Simulate network delay
    const alertBox = document.getElementById('loginAlert');
    alertBox.innerHTML = '<span class="text-primary">Authenticating...</span>';

    setTimeout(() => {
        // Save mock session
        sessionStorage.setItem('demo_user', JSON.stringify({ username, name, role }));
        window.location.href = 'dashboard.html';
    }, 800);
}

// Dynamic Sidebar Renderer based on role
function renderSidebar(role) {
    const sidebar = document.getElementById('dynamicSidebar');
    if (!sidebar) return;

    let html = `
        <div class="sb-sidenav-menu-heading">Core</div>
        <a class="nav-link" href="dashboard.html">
            <div class="sb-nav-link-icon"><i class="bi-speedometer"></i></div>
            Dashboard
        </a>
    `;

    if (role === 'executive' || role === 'admin') {
        html += `
            <div class="sb-sidenav-menu-heading">Transactions</div>
            <a class="nav-link" href="loans.html">
                <div class="sb-nav-link-icon"><i class="bi-stack"></i></div>
                Loans Registry
            </a>
            <div class="sb-sidenav-menu-heading">Customers</div>
            <a class="nav-link" href="customers.html">
                <div class="sb-nav-link-icon"><i class="bi-people"></i></div>
                Customers Registry
            </a>
        `;
    }

    if (role === 'officer' || role === 'admin') {
        html += `
            <div class="sb-sidenav-menu-heading">Transactions</div>
            <a class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseLoans" aria-expanded="false">
                <div class="sb-nav-link-icon"><i class="bi-stack"></i></div>
                Loans
                <div class="sb-sidenav-collapse-arrow"><i class="bi-chevron-down"></i></div>
            </a>
            <div class="collapse" id="collapseLoans" data-bs-parent="#sidenavAccordion">
                <nav class="sb-sidenav-menu-nested nav">
                    <a class="nav-link" href="loans.html">Loans Registry</a>
                    <a class="nav-link" href="loan-add.html">New Loan</a>
                </nav>
            </div>
            <a class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseCustomers" aria-expanded="false">
                <div class="sb-nav-link-icon"><i class="bi-people"></i></div>
                Customers
                <div class="sb-sidenav-collapse-arrow"><i class="bi-chevron-down"></i></div>
            </a>
            <div class="collapse" id="collapseCustomers" data-bs-parent="#sidenavAccordion">
                <nav class="sb-sidenav-menu-nested nav">
                    <a class="nav-link" href="customers.html">Customers Registry</a>
                    <a class="nav-link" href="customer-add.html">New Customer</a>
                </nav>
            </div>
            <div class="sb-sidenav-menu-heading">Importing</div>
            <a class="nav-link" href="imports.html">
                <div class="sb-nav-link-icon"><i class="bi-upload"></i></div>
                Upload Bulk Data
            </a>
        `;
    }

    if (role === 'admin') {
        html += `
            <div class="sb-sidenav-menu-heading">User Accounts</div>
            <a class="nav-link" href="users.html">
                <div class="sb-nav-link-icon"><i class="bi-people"></i></div>
                All Users
            </a>
            <a class="nav-link" href="logs.html">
                <div class="sb-nav-link-icon"><i class="bi-clock-history"></i></div>
                Logs Registry
            </a>
        `;
    }

    if (role === 'customer') {
        html += `
            <a class="nav-link" href="my-transactions.html">
                <div class="sb-nav-link-icon"><i class="bi-clock-history"></i></div>
                My Transactions History
            </a>
        `;
    }

    sidebar.innerHTML = html;
}