# Real Ecommerce Store

## Project Overview

This is a full-stack e-commerce store built with Next.js, React, Redux, Supabase, MongoDB, and Stripe. It includes user authentication, role-based access control, cart management, order placement, and payment handling.

## Key Features

- User authentication with email verification and OTP
- Role-based access control (RBAC) for Super Admin, Admin, Product Manager, and Order Manager
- Product listing with cart support
- Order placement and order creation in MongoDB
- COD payment flow support via backend logic
- Stripe/Paiker integration stubs for future payments
- Admin and customer dashboard layout

## Project Structure

- `src/app/` — Next.js App Router pages and API routes
- `src/components/` — UI components and shared elements
- `src/lib/` — helper utilities, auth, database connection, payment helpers
- `src/models/` — Mongoose models for `User` and `Order`
- `src/redux/` — Redux slices and thunk logic for auth, cart, products, payments
- `src/email/` — verification email template

## Setup and Run

1. Install dependencies

```bash
cd 01_real_ecommerce_store
npm install
```

2. Add environment variables in `.env.local`

Required variables:

- `MONGODB_URI` — MongoDB connection string
- `NEXT_PUBLIC_APP_DOMAIN` — app domain for email links
- `JWT_SECRET` — secret for JWT token generation
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key
- `RESEND_API_KEY` — email sending API key
- `STRIPE_SECRET_KEY` — Stripe secret key (if Stripe integration is enabled)
- `NEXTAUTH_URL` or `NEXT_PUBLIC_...` if needed for Next.js config

3. Run local development server

```bash
npm run dev
```

## Important API Routes

- `POST /api/products/order/place` — create an order from the customer cart
- `POST /api/products/order/confirmation/[id]` — submit payment confirmation for an order
- `GET /api/products/order/fetch-orders` — fetch authenticated user orders
- `POST /api/auth/signup` — register a user
- `POST /api/auth/verify-otp` — verify OTP after signup
- `POST /api/auth/resend-otp` — resend OTP code

## Payment and Order Logic

### COD Flow

- The backend supports `COD` as a payment method in `src/app/api/products/order/place/route.js`
- The order is created with payment `status: PENDING`
- `src/lib/payments/cod.js` returns delivery fee data and COD payment instructions
- Order confirmation is expected through `src/app/api/products/order/confirmation/[id]/route.js`
- The confirmation route validates `paymentMethod`, `transactionId`, and COD `channel` (`EASYPAISA` or `BANK`)

### Stripe / Paiker

- Stripe and Paiker integrations are present as placeholders in `src/lib/payments/stripe.js` and `src/lib/payments/paiker.js`
- The order placement route currently has the Stripe/Paiker branches commented out

## Known Missing or Incomplete Areas

### README

This repository had an incomplete README. It has been expanded to include setup, architecture, and known issues.

### Order History UI

- There is currently no dedicated customer order history page or product history page implemented
- The customer dashboard home page only displays user profile info, not order history
- `My Orders` navigation currently points to `/customer/dashboard`, which renders the dashboard home page

### Checkout / Payment UI

- The cart page exists and links to `/customer/dashboard/orderPlace`
- The `orderPlace` page has static payment cards and buttons but no actual payment form or API submission
- There is no frontend flow to submit `shippingAddress`, `paymentMethod`, or order confirmation data
- COD proof upload / confirmation UI is missing

### Backend / API Issues

- `src/app/api/products/order/fetch-orders/route.js` calls `getUserFromCookies()` without passing `req`, which will break authenticated order fetching
- Payment status handling is minimal and does not yet support full Stripe/Paiker flow
- Product history and order activity tracking are not implemented in the frontend

## Bugs and Fix Recommendations

- Fix `fetch-orders` route to accept `req` and authenticate correctly:
  ```js
  const user = await getUserFromCookies(req);
  ```
- Implement a customer order history page and wire `My Orders` to it
- Add a shipping/payment form on `/customer/dashboard/orderPlace`
- Add frontend submission to `POST /api/products/order/place`
- Add COD proof upload handling and confirmation UI
- Ensure `getUserFromCookies` is called with `req` in all API routes that require authentication

## RBAC Summary

| Role            | Products | Orders | Users | Settings |
| --------------- | -------- | ------ | ----- | -------- |
| Super Admin     | ✅        | ✅      | ✅     | ✅        |
| Admin           | ✅        | ✅      | ❌     | ❌        |
| Product Manager | ✅        | ❌      | ❌     | ❌        |
| Order Manager   | ❌        | ✅      | ❌     | ❌        |

## Notes

- The project appears to use Supabase for cart storage and MongoDB for orders/users
- The customer dashboard layout is in `src/app/(user-pages)/customer/dashboard`
- Admin dashboard routes are separate under `src/app/(user-pages)/admin`

---

This README now reflects the current state of the application and identifies the main missing pieces for payment, order history, COD, and product history UX/logic.

---

## ✅ Completed in this update

This section documents what was added on top of the existing codebase. Nothing in the original files was rewritten or removed — only the specific bug below was fixed and new files were added.

### Fixed
- `tsconfig.json` had an invalid `"ignoreDeprecations": "6.0"` value that made `next build` fail on TypeScript 5.9 with `Invalid value for '--ignoreDeprecations'`. Changed to `"5.0"` so the project actually builds.

### Checkout — COD + EasyPaisa (`/customer/dashboard/orderPlace`)
- The page was fully static before (buttons did nothing). It now:
  1. Collects the shipping address and lets the user choose **Cash on Delivery**. Stripe/Paiker are shown as "Coming soon" since their order-placement branches aren't implemented in the API yet.
  2. Submits the order to the existing `POST /api/products/order/place` route.
  3. Shows the EasyPaisa delivery-fee instructions returned by `src/lib/payments/cod.js`.
  4. Lets the user submit their **EasyPaisa transaction ID** (required) and an optional payment screenshot URL, which is sent to the existing `POST /api/products/order/confirmation/[id]` route (channel `EASYPAISA`).
  5. If a customer left before finishing step 4, they can resume via `orderPlace?orderId=...` (linked from the order history page).

### Customer order & product history (`/customer/dashboard/orders`)
- New page listing all of the logged-in user's orders (from `GET /api/products/order/fetch-orders`, which was already implemented), with items, shipping address, payment status/method/transaction ID, and order status.
- New Redux slice `orderHistorySliceTunk.js` (`state.orderHistory`) added to the store.
- This is the page the existing "Orders" sidebar link now correctly points to.

### Admin panel — transaction history & per-customer product history (`/admin/dashboard/orders`)
- New API routes (admin/root only, same auth pattern as `list-users`):
  - `GET /api/admin/orders/list` — list all orders, filterable by `userId`, `paymentStatus`, `paymentMethod`, `status`.
  - `PATCH /api/admin/orders/[id]/status` — update `paymentStatus` (e.g. verify a submitted EasyPaisa transaction as `PAID`/`FAILED`) and/or `orderStatus`.
- New page shows every order with customer, items, total, payment method/status (editable), transaction ID + proof link, and order status (editable).
- Visiting `/admin/dashboard/orders?userId=<id>` filters to a single customer's order/product history. A "View history" link was added next to each user in `Admin Panel – User Roles` and next to each row in the transaction table.
- New Redux slice `adminOrdersSliceTunk.js` (`state.adminOrders`) added to the store.
- Added an "Orders / Transactions" link to the admin sidebar (replacing the old placeholder "Order" link that pointed nowhere).

### Data storage (unchanged, confirmed working as designed)
- Supabase (`ecommerce_store_products`, `carts`, `cart_items`) continues to be used for products and cart, exactly as before — no schema changes were needed.
- MongoDB (`User`, `Order`) continues to store users, roles, and orders/transactions, exactly as before.

## ⚠️ Still outside this scope
- Stripe and Paiker checkout are still stubs — only their placeholder files exist; wiring them into `order/place/route.js` would be a separate task.
- There's no file-upload storage configured (e.g. Supabase Storage bucket) for payment proof images — the proof field currently accepts a pasted image URL, matching the existing pattern used for product images.
