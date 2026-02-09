# BCC Canteen

### ⚠️⚠️⚠️

```
Submissions from 2025 students will have much higher priority than submissions from 2024, SAP, or higher students.
Please take note of this before planning to attempt this freepass challenge.
```

## 💌 Invitation Letter

As campus life continues to evolve, the need for a fast, transparent, and efficient canteen service becomes increasingly important. We recognize that both customers and canteen operators require a system that simplifies food ordering, payment processing, menu management, and administrative control.

To address this need, we introduce BCC Canteen, a digital platform designed to transform how campus canteens operate. This system aims to provide a seamless food ordering and payment experience for users, efficient menu and order management for canteen owners, and centralized supervision for administrators.

## **⭐** Minimum Viable Product (MVP)

As the initial development phase of BCC Canteen, the system must support the following minimum features:

- New users can register an account ✔️
- Users can log in to the system ✔️
- Users can edit their profile information ✔️
- Users can view available canteens and food menus ✔️
- Users can place food orders (only if stock is available) ✔️
- Users can make payments for their orders ✔️
- Users can view order status of their orders ✔️
- Users can leave feedback or reviews for completed orders ✔️
- Canteen owners can create, update, and delete food menus including stock ✔️
- Canteen owners can view incoming orders ✔️
- Canteen owners can view payment status of orders (e.g., Unpaid, Paid) ✔️
- Canteen owners can update order status (e.g., Waiting, Cooking, Ready, Completed) ✔️
- Canteen owners can remove inappropriate user feedback ✔️
- Admin can add new canteen owner accounts ✔️
- Admin can edit canteen owner accounts ✔️
- Admin can remove user or canteen owner accounts ✔️

## **🌎** Service Implementation

```
GIVEN => I am a new user
WHEN  => I register in the system
THEN  => The system will store and return my registration details

GIVEN => I am a user
WHEN  => I log in to the system
THEN  => The system will authenticate and grant access based on my credentials

GIVEN => I am a user
WHEN  => I edit my profile
THEN  => The system will update my profile information

GIVEN => I am a user
WHEN  => I view available canteens and menus
THEN  => The system will display all canteens and their menu details

GIVEN => I am a user
WHEN  => I place a food order
THEN  => The system will check stock availability, decrease the stock, and record the order with "Unpaid" status

GIVEN => I am a user
WHEN  => I make a payment for my order
THEN  => The system will verify the payment and update payment status to "Paid"

GIVEN => I am a user
WHEN  => I view my order details
THEN  => The system will display order information including payment status (e.g., Paid) and order status (e.g., Cooking)

GIVEN => I am a user
WHEN  => I leave feedback for a completed order
THEN  => The system will save and display my feedback

GIVEN => I am a canteen owner
WHEN  => I create a new menu item
THEN  => The system will store and publish the menu item

GIVEN => I am a canteen owner
WHEN  => I update a menu item
THEN  => The system will apply and confirm the changes

GIVEN => I am a canteen owner
WHEN  => I delete a menu item
THEN  => The system will remove the menu item from the system

GIVEN => I am a canteen owner
WHEN  => I view incoming orders
THEN  => The system will display all orders related to my canteen

GIVEN => I am a canteen owner
WHEN  => I view order payment status
THEN  => The system will display the payment status of each order

GIVEN => I am a canteen owner
WHEN  => I update the order status (e.g., set to "Cooking")
THEN  => The system will update the status only if the order has been paid

GIVEN => I am a canteen owner
WHEN  => I remove user feedback
THEN  => The system will delete the feedback from the system

GIVEN => I am an admin
WHEN  => I add a new canteen owner
THEN  => The system will create a canteen owner account

GIVEN => I am an admin
WHEN  => I edit canteen owner accounts
THEN  => The system will update canteen owner account

GIVEN => I am an admin
WHEN  => I remove a user or canteen owner
THEN  => The system will delete the account from the system
```

## **👪** Entities and Actors

We want to see your perspective about these problems. You can define various types of entities or actors. One thing for sure, there is no true or false statement to define the entities. As long as the results are understandable, then go for it! 🚀

## **📘** References

You might be overwhelmed by these requirements. Don't worry, here's a list of some tools that you could use (it's not required to use all of them nor any of them):

1. [Example Project](https://github.com/meong1234/fintech)
2. [Git](https://try.github.io/)
3. [Cheatsheets](https://devhints.io/)
4. [REST API](https://restfulapi.net/)
5. [Insomnia REST Client](https://insomnia.rest/)
6. [Test-Driven Development](https://www.freecodecamp.org/news/test-driven-development-what-it-is-and-what-it-is-not-41fa6bca02a2/)
7. [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
8. [GraphQL](https://graphql.org/)
9. [gRPC](https://grpc.io/)
10. [Docker Compose](https://docs.docker.com/compose/install/)

## **🔪** Accepted Weapons

> BEFORE CHOOSING YOUR LANGUAGE, PLEASE VISIT OUR [CONVENTION](CONVENTION.md) ON THIS PROJECT
>
> **Any code that did not follow the convention will be rejected!**
>
> 1. Golang (preferred)
> 2. NodeJS
> 3. PHP
> 4. Java

You are welcome to use any libraries or frameworks, but we appreciate it if you use the popular ones.

## **🎒** Tasks

```
The implementation of this project MUST be in the form of a REST, gRPC, or GraphQL API (choose AT LEAST one type).
```

1. Fork this repository
2. Follow the project convention
3. Finish all service implementations
4. Write the installation guide of your back-end service in the section below

## **🧪** API Installation

### Prerequisites

Before running this service, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** (v14 or higher)

### Installation Steps

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   Copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```

   Configure the following variables in your `.env` file:

   **Required Configuration:**
   - `APP_KEY` - Generate using: `node ace generate:key`
   - `DB_HOST` - PostgreSQL host (default: `127.0.0.1`)
   - `DB_PORT` - PostgreSQL port (default: `5432`)
   - `DB_USER` - PostgreSQL username (default: `root`)
   - `DB_PASSWORD` - PostgreSQL password (default: `root`)
   - `DB_DATABASE` - Database name (default: `app`)
   - `MIDTRANS_SERVER_KEY` - Your Midtrans server key (get from [Midtrans Dashboard](https://dashboard.midtrans.com/))
   - `MIDTRANS_CLIENT_KEY` - Your Midtrans client key (get from [Midtrans Dashboard](https://dashboard.midtrans.com/))

   **Optional Configuration:**
   - `PORT` - Server port (default: `3333`)
   - `HOST` - Server host (default: `localhost`)
   - `MIDTRANS_ENV` - Midtrans environment (default: `sandbox`, use `production` for live)

3. **Create PostgreSQL database**

   ```bash
   createdb bcc_canteen
   ```

   Or create manually via PostgreSQL client/pgAdmin.

4. **Run database migrations**

   ```bash
   node ace migration:run
   ```

5. **Seed the database (optional)**

   ```bash
   node ace db:seed
   ```

   This will create sample data including:
   - 1 admin account
   - 1 regular user account
   - 3 canteen owner accounts
   - 3 canteens (Mie Ayam Solo Pak Sabar, Nasi Goreng Bang Gentong, Geprek Legend)
   - Menus for each canteen
   - Sample tables

6. **Generate APP_KEY**

   ```bash
   node ace generate:key
   ```

   Copy the generated key to `APP_KEY` in your `.env` file.

7. **Start the development server**

   ```bash
   npm run dev
   ```

   The API will be available at: `http://localhost:3333`

### Default Credentials (after seeding)

**Admin:**

- Email: `admindemo@gmail.com`
- Password: `admindemo123`

**Regular User:**

- Email: `userdemo@gmail.com`
- Password: `userdemo123`

**Canteen Owners:**

- Email: `ownerdemo@gmail.com` (Pak Sabar - Mie Ayam Solo) / Password: `ownerdemo123`
- Email: `owner.banggentong@gmail.com` (Bang Gentong - Nasi Goreng) / Password: `owner123`
- Email: `owner.gepreklegend@gmail.com` (Geprek Legend) / Password: `owner123`

### Api Documentation

1. **Access the API documentation**

   You can access the API documentation at:

   ```
   https://gl71p1jkcw.apidog.io/
   ```

2. **Explore the endpoints**

   You can access the deployed API at:

   ```
   http://bcc-canteen.iccn.or.id/api
   ```

### Api Implementation

**Frontend Application:**

You can access the live frontend application at:

User Role:
```
http://bcc-canteen.iccn.or.id
```

Canteen Owner Role:
```
http://bcc-canteen.iccn.or.id/owner/login
```

**Try Ordering:**

To place an order, you can scan the QR code below (Meja 1):

<img src="docs/TABLE_1.png" alt="Meja 1 QR Code" width="300">


### Testing Payment Gateway

For testing payment transactions in sandbox environment, you can use the Midtrans Payment Simulator:

**Midtrans Payment Simulator:**
- URL: [https://simulator.sandbox.midtrans.com/](https://simulator.sandbox.midtrans.com/)

This simulator allows you to test various payment scenarios including:
- Successful payments
- Failed payments
- Pending payments

Simply paste the payment or QRIS URL or transaction token from the API response into the simulator to complete the payment process.

## **📞** Contact

Have any questions? You can contact [Atha](https://www.instagram.com/mhqif/).

## **🎁** Submission

Please follow the instructions on the [Contributing guide](CONTRIBUTING.md).

![cheers](https:

> This is not the only way to join us.
>
> **But, this is the _one and only way_ to instantly pass.**
