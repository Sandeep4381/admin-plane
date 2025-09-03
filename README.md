# SawariKaro Super Admin Dashboard

Welcome to the SawariKaro Super Admin Dashboard, a comprehensive web application built with Next.js and Tailwind CSS for managing a vehicle rental platform. This dashboard provides administrators with a powerful suite of tools to oversee every aspect of the business, from user and shop management to financial tracking and promotional campaigns.

## Key Technologies

- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI Integration**: Genkit for intelligent data analysis
- **Language**: TypeScript

## Core Features

The dashboard is organized into several dedicated sections, each designed to handle a specific domain of the platform.

### 1. Dashboard (`/`)

The main landing page provides a high-level, at-a-glance overview of the entire platform's health and key performance indicators (KPIs).

- **Stats Cards**: Quick insights into total shops, verified shops, users, active and completed rentals, cancellations, and platform earnings.
- **Rentals Overview**: A bar chart visualizing rental volume over time to track growth and seasonal trends.
- **Vehicle Type Split**: A pie chart showing the distribution of rentals across different vehicle categories (cars, bikes, scooters, etc.).
- **Cancellation Ratio**: A donut chart comparing completed rentals to cancelled ones, offering a clear view of the cancellation rate.

### 2. Shops (`/shops`)

This section is dedicated to managing the vehicle rental shops partnered with the platform.

- **Tabbed Interface**: Filter shops by status: `All`, `Verified`, `Pending`, `Restricted`, `Blocked`, and `Rejected`.
- **Shop Management**: Add new shops, edit existing details, and view a comprehensive list of all partners.
- **Verification Workflow**: A dedicated dialog for reviewing and verifying new shop applications, including document preview.
- **Admin Actions**: Suspend, block, unblock, restrict, or delete shops with confirmation dialogs and reason prompts.

### 3. Users (`/users`)

Manage all customer accounts from a centralized location.

- **User Segmentation**: Tabs to filter users by `All`, `Active`, `Verified`, `Inactive`, and `Blocked` status.
- **User Profile Drawer**: A detailed slide-out panel showing a 360-degree view of the user, including rental history, lifetime spend, wallet balance, and support logs.
- **Direct Communication**: Send push notifications, emails, or SMS messages directly from the user profile.
- **Status Management**: Manually verify, block, or unblock users.

### 4. Rentals (`/rentals`)

A comprehensive system for overseeing all rental bookings on the platform.

- **Real-time Tracking**: Tabs to monitor rentals by status: `All`, `Active`, `Upcoming`, `Completed`, `Cancelled`, and `Disputed`.
- **Detailed Rental View**: A drawer reveals complete details for any booking, including user/shop info, fare breakdown, payment status, and internal admin notes.
- **Dispute Resolution**: A built-in workflow to manage and resolve disputes, assigning responsibility to the user, shop, or platform.
- **Critical Actions**: Cancel bookings, process refunds, or reassign vehicles directly from the dashboard.

### 5. Offers & Campaigns (`/offers`)

Create and manage promotional offers to drive user engagement and bookings.

- **Offer Lifecycle Management**: Separate tabs for `Active`, `Scheduled`, and `Expired` offers.
- **Flexible Offer Creation**: A powerful dialog to create diverse offers (percentage-based, flat discounts, etc.), define validity dates, and set target audiences.
- **Performance Tracking**: Stat cards provide a quick look at total redemptions, conversion rates, and revenue impact.
- **Activation Control**: Manually activate scheduled offers with a single click.

### 6. Cancellations (`/cancellations`)

A data-driven section to analyze and mitigate booking cancellations.

- **AI-Powered Analyzer**: Paste raw cancellation reasons into a text area and use Genkit to generate an analysis of key themes and actionable suggestions.
- **Statistical Dashboard**: Visualize cancellation data through stats cards, a pie chart (breakdown by reason), and a bar chart (by user type).
- **Identify Hotspots**: A table highlights shops with high cancellation rates, filterable by reason, and a heatmap visualizes cancellations by geographical area.

### 7. Earnings (`/earnings`)

A financial command center to track revenue, commissions, and payouts.

- **Financial KPIs**: Top-level cards display `Total Revenue`, `Total Commission`, `Net Profit`, and `Shop Payouts`.
- **In-depth Charts**: Includes a bar chart for monthly revenue/commission trends and a pie chart for revenue breakdown by vehicle type.
- **Transaction Logs**: View recent transactions and a leaderboard of top-earning shops.
- **Admin Controls**: Export financial reports (CSV, PDF, Excel), and access placeholders for scheduling automated reports and viewing tax breakdowns.

### 8. Notifications (`/notifications`)

A central hub for communicating with users and shops.

- **Multi-Channel Composer**: Craft messages and send them via Push Notification, Email, or SMS.
- **Live Preview**: See how your notification will look on a mobile device or in an email client as you type.
- **Targeted Audience**: Select a specific audience segment for your message (e.g., All Users, Inactive Users, All Shops).
- **Sent History**: A log of previously sent notifications shows the message, audience, channel, and delivery status.

### 9. Banners (`/banners`)

Manage in-app promotional banners.

- **Banner Management**: Upload, edit, and schedule promotional banners for various sections of the user app.
- **Performance Tracking**: Monitor `Impressions`, `Clicks`, and `Click-Through Rate (CTR)` for each banner.
- **Status Control**: Banners are automatically categorized as `Active`, `Scheduled`, or `Expired` based on their validity dates.

### 10. Admin Controls (`/admin-controls`)

Securely manage your administrative team and their access levels.

- **Sub-Admin Management**: Add, edit, suspend, or delete sub-administrator accounts.
- **Role-Based Access Control (RBAC)**: A permissions matrix allows the super admin to define fine-grained permissions for different roles, controlling access to each section of the dashboard.
- **Audit Trail**: The "Action Logs" tab provides a searchable and exportable record of all significant actions performed by administrators, ensuring accountability.
