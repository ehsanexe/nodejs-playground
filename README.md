# Shop Project

## Overview

This project is a comprehensive Node.js and Express application designed to demonstrate core concepts of Node.js development. Utilizing an MVC (Model-View-Controller) architecture, this application integrates various technologies to create a robust online shop experience.

## Features

- **Core Node Concepts**: Each concept is implemented in a separate branch for ease of understanding.
- **MongoDB & Mongoose**: NoSQL database for data storage, accessed using Mongoose for object modeling.
- **EJS Templating Engine**: Dynamic rendering of HTML pages with Embedded JavaScript.
- **User Authentication**: Secure authentication using cookies and sessions.
- **Email Notifications**: Users receive emails upon account creation, integrated with Mailtrap.
- **Payment Processing**: Integrated with Stripe for secure payment checkout.
- **File Uploads**: Users can upload image files for different products.
- **Invoice Generation**: Downloadable invoices generated using PDFKit.
- **Data Validation**: Implemented using Express Validator to ensure data integrity.
- **Pagination**: Efficiently handles large datasets for improved user experience.

## Branches

- **Core Concepts**: Each branch demonstrates specific core concepts of Node.js and Express.
- **SQL Integration**: Examples of integrating SQL databases and Sequelize are available in separate branches.

## Getting Started

### Prerequisites

- Node.js
- MongoDB Atlas account
- A Mailtrap account (for email notifications)
- Stripe account (for payment processing)

### Installation

1. Install dependencies:
   ```bash
   npm install
2. Set up your environment variables in a .env file:
   ```bash
   NODEMAILER_USER=your_email_user
   NODEMAILER_PASSWORD=your_email_password
   MONGO_DB=your_mongo_db_uri
   STRIPE=your_stripe_secret_key
3. Start the server:
   ```bash
   npm start
4. Visit http://localhost:3010 in your browser.
