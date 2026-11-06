# UNRE Staff Loan Management System - Demo

**Live Demo:** [Insert your GitHub Pages URL here, e.g., `https://yourusername.github.io/unre-loans-demo/`]

This repository contains a static, front-end prototype of the UNRE Staff Loan Management System (LMS). It is built entirely with HTML, CSS, and JavaScript, utilizing modern CDNs for libraries like Bootstrap 5, DataTables, and jQuery.

## 🎯 Purpose of this Demo

The actual system is a full-stack PHP MVC web application designed for the Bursary Department at the Papua New Guinea University of Natural Resources and Environment (PNG UNRE).

This demo was created to:

* **Showcase the UI/UX:** Provide a fully navigable, clickable preview of the interface without needing a PHP server or database setup.
* **Validate Layouts & Features:** Ensure the responsive design, modals, and data tables work perfectly on modern web browsers.
* **Simulate Real Data:** Use a mock `data.json` file and a custom JavaScript "data engine" to mimic backend database queries, table joins, and real-time calculations.

## ✨ What the Actual Application Does

The real PHP application replaces manual, spreadsheet-based loan tracking with a centralized, automated platform. Key features include:

* **Automated Loan Calculations:** Real-time calculation of total payable amounts, periodic payments, and penalty charges based on user inputs.
* **Dynamic Payment Scheduling:** Automatically generates a full repayment schedule (Monthly or Fortnightly) when a loan is marked as "Released".
* **Payment Tracking:** Records individual payments, automatically detects if a payment is overdue based on the schedule, and applies penalty rates accordingly. Loans automatically close when fully paid.
* **Customer & User Management:** Manages staff profiles, loan histories, and system access.
* **Bulk Data Importing:** Allows Bursary staff to upload CSV files to instantly process multiple loans, payments, or customer profiles.
* **Audit Trail:** Comprehensive logging of all user login attempts and system activities for security and tracking.

## 👥 User Roles & Access

The system is built with strict Role-Based Access Control (RBAC). You can simulate these roles in the demo by logging in:

* **Super Administrator:** (Try username: `admin`)  
  Full system access. Manages user accounts, toggles staff permissions, and views system logs.
* **Executive Employee:**  
  Read-only access to view loans, customers, and print reports/statements.
* **Officer Employee (Bursary Staff):**  
  The primary users. Depending on their assigned permissions, they add/edit loans, record payments, manage customers, and run bulk imports.
* **Customer (Staff Member):** (Try PO#: `246`)  
  Self-service portal. Can only view their own profile, loan details, payment schedules, and transaction history.

## 🛠️ Technology Stack (Demo)

* HTML5 / CSS3
* Bootstrap 5.3 (CDN)
* Bootstrap Icons (CDN)
* jQuery 3.7 (CDN)
* DataTables 2.0 (CDN) for interactive tables and exporting.
* Print.js (CDN) for generating printable invoices and statements.
* Mock Data: `data.json` is parsed by `assets/js/data-engine.js` to simulate a backend database.

## 🚀 Navigating the Demo

Since this is a static site, data changes are not permanently saved (refreshing the page resets the data).

1. **To log in:** Use `admin` for the staff/admin tab, or `246` for the customer tab. Any password will work.
2. **To view a Loan:** Go to the Loans Registry and click on a Reference Number (e.g., `00000002`).
3. **To view a Transaction Statement:** Go to the Customers Registry, click a customer, and click "Transaction Activity".

> **Note:** This demo is for preview purposes only. All data is mocked. The production application is built using a custom PHP MVC framework and a MySQL database.