// =========================================
// UNRE LMS DEMO - DATA ENGINE (Mock Backend)
// =========================================

let DB = {
    users: [],
    customers: [],
    loans: [],
    transactions: []
};

// Fetch the JSON data
async function loadDatabase() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        DB = data;
        return true;
    } catch (error) {
        console.error("Failed to load demo data:", error);
        return false;
    }
}

// --- HELPER FUNCTIONS (From methods.php & datetime.php) ---

function format_number(num) {
    if (num === null || num === undefined) return "0.00";
    return parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function date_toText(dateStr) {
    if (!dateStr || dateStr === "0000-00-00") return "-- -- ----";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function short_date_toText(dateStr) {
    if (!dateStr || dateStr === "0000-00-00") return "-- -- ----";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB'); // dd/mm/yyyy
}

// --- HELPER FUNCTIONS (From message.php) ---

function loan_status(status) {
    let type = "light";
    switch (status) {
        case 'Pending': type = "dark"; break;
        case 'Approved': type = "info"; break;
        case 'Released': type = "primary"; break;
        case 'Completed': type = "success"; break;
        case 'Denied': type = "danger"; break;
    }
    return `<span class="badge bg-${type} rounded-pill">${status}</span>`;
}

function badge(active) {
    return active == 1 
        ? `<span class="badge bg-success rounded-pill">Active</span>` 
        : `<span class="badge bg-danger rounded-pill">Inactive</span>`;
}

// --- MOCK SQL QUERIES ---

// Mimics: $customerModel->single_customer($id) and $userModel->single_user($userID)
function getCustomerDetails(customerID) {
    const customer = DB.customers.find(c => c.customerID == customerID);
    if (!customer) return null;
    
    const user = DB.users.find(u => u.userID == customer.userID);
    
    return {
        ...customer,
        lastname: user ? user.lastname : "Unknown",
        firstname: user ? user.firstname : "User",
        email: user ? user.username + "@unre.ac.pg" : "N/A"
    };
}

// Mimics: $transactionModel->single_transaction($transactionID)
function getTransaction(transactionID) {
    return DB.transactions.find(t => t.transactionID == transactionID);
}

// Mimics the complex join in Loans Registry
function getLoanRegistryData() {
    return DB.loans.map(loan => {
        const trans = getTransaction(loan.transactionID);
        const customer = trans ? getCustomerDetails(trans.customerID) : null;
        
        return {
            ...loan,
            customerName: customer ? `${customer.lastname}, ${customer.firstname}` : "Unknown Customer",
            customerID: customer ? customer.customerID : "N/A",
            // Prepare data for DataTables rendering
            formattedTotal: format_number(loan.total),
            formattedDue: format_number(loan.amount_due),
            statusBadge: loan_status(loan.status),
            dateReleased: short_date_toText(loan.date_released)
        };
    });
}

// Mimics the complex join in Customers Registry
function getCustomerRegistryData() {
    return DB.customers.map(customer => {
        const user = DB.users.find(u => u.userID == customer.userID);
        return {
            ...customer,
            fullName: user ? `${user.lastname}, ${user.firstname}` : "Unknown",
            email: user ? user.username + "@unre.ac.pg" : "N/A",
            statusBadge: badge(customer.active)
        };
    });
}

// =========================================
// ADDITIONS FOR PHASE 3 (Loan View & Statement)
// =========================================

// Mimics: $loanModel->calc_total_number_payments()
function calc_total_number_payments(period, payments_period) {
    const pay_per_year = payments_period === "Fortnightly" ? 26 : 12;
    return period * pay_per_year;
}

// Mimics: $loanModel->calc_monthly_pay()
function calc_monthly_pay(total, period, payments_period) {
    const pay_per_year = payments_period === "Fortnightly" ? 26 : 12;
    return total / (period * pay_per_year);
}

// Mimics: $loanModel->calc_penalty_amt()
function calc_penalty_amt(monthly, penalty_rate) {
    return monthly * (penalty_rate / 100);
}

// Mimics the Loans::view() controller logic
function getLoanViewData(loanID) {
    const loan = DB.loans.find(l => l.loanID == loanID);
    if (!loan) return null;

    const trans = getTransaction(loan.transactionID);
    const customer = trans ? getCustomerDetails(trans.customerID) : null;
    
    // Calculate derived fields
    const total_num_payments = calc_total_number_payments(loan.duration, loan.payments_period);
    const payable_amt = calc_monthly_pay(loan.total, loan.duration, loan.payments_period);
    const penalty_amt = calc_penalty_amt(payable_amt, loan.penalty_rate);

    return {
        loan: loan,
        transaction: trans,
        customer: customer,
        total_num_payments: total_num_payments,
        payable_amt: payable_amt,
        penalty_amt: penalty_amt,
        // Formatted values for display
        f_total: format_number(loan.total),
        f_amount: format_number(loan.amount),
        f_interest: format_number(loan.interest),
        f_due: format_number(loan.amount_due),
        f_applied: format_number(loan.amount_applied),
        f_payable: format_number(payable_amt),
        f_penalty: format_number(penalty_amt),
        statusBadge: loan_status(loan.status),
        dateReleased: date_toText(loan.date_released),
        dateClosed: date_toText(loan.date_closed)
    };
}

// =========================================
// ADDITIONS FOR PHASE 4 (Users & Logs)
// =========================================

// Mock Logs Data
const mockLogs = [
    { logID: '10290029', log_username: 'elaki', login_attempt: 1, userID: 2200001, login_on: '2022-04-11 23:23:11', logout_on: '2022-04-11 23:23:40', ip_address: '::1' },
    { logID: '1548963', log_username: 'msmith', login_attempt: 1, userID: 2200010, login_on: '2022-04-11 19:24:57', logout_on: '2022-04-11 19:25:08', ip_address: '::1' },
    { logID: '25436239', log_username: '246', login_attempt: 1, userID: 2200004, login_on: '2022-04-11 19:22:48', logout_on: '2022-04-11 19:24:46', ip_address: '::1' },
    { logID: '37771840', log_username: '', login_attempt: 0, userID: null, login_on: null, logout_on: '2026-10-27 15:07:00', ip_address: '' },
    { logID: '68679938', log_username: 'admin', login_attempt: 1, userID: 2200000, login_on: '2022-04-11 23:23:44', logout_on: '2022-04-11 23:26:29', ip_address: '::1' }
];

// Mimics: $userModel->all_users() joined with roles
function getUserRegistryData() {
    const roles = { 1: "Super Administrator", 2: "Executive Employee", 3: "Officer Employee", 4: "Customer" };
    
    return DB.users.map(user => {
        return {
            ...user,
            fullName: `${user.lastname}, ${user.firstname}`,
            roleName: roles[user.roleID] || "Unknown",
            statusBadge: badge(1), // Hardcoded active for demo
            dateCreated: "2022-01-14"
        };
    });
}

// Mimics: $logModel->all_logs()
function getLogsRegistryData() {
    return mockLogs.map(log => {
        const user = DB.users.find(u => u.userID == log.userID);
        let attemptBadge = log.login_attempt == 1 
            ? `<span class="badge bg-success rounded-pill">Successful</span>` 
            : `<span class="badge bg-danger rounded-pill">Unsuccessful</span>`;
            
        return {
            ...log,
            attemptBadge: attemptBadge,
            formattedLogin: log.login_on ? log.login_on : "---- -- --",
            formattedLogout: log.logout_on ? log.logout_on : "---- -- --"
        };
    });
}