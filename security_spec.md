# Security Specification: Mudis Merit Venture Firebase Integration

## 1. Data Invariants

1. **Catalog Integrity (Products & Services)**:
   - Any website visitor can read products (`/products/{productId}`) and services (`/services/{serviceId}`).
   - Only authenticated administrators (`isAdmin()`) can create, update, or delete products and services.
   - Prices must be positive numbers. Product names and service titles must be bounded strings.
   
2. **Customer Lead Protection (Inquiries)**:
   - Anyone (including prospective clients and guest visitors) can submit a quote or foam calculation (`create` on `/inquiries/{inquiryId}`).
   - New inquiry payloads must start with `status == 'new'` and contain valid customerName and phone.
   - Inquiries contain customer contact details (phone, email); therefore, reading (`get`, `list`), updating, and deleting inquiries is strictly restricted to authenticated administrators (`isAdmin()`).

3. **Admin Escalation Prevention**:
   - The `/admins/{adminId}` collection defines who is allowed administrative rights.
   - Only existing authenticated administrators or the bootstrapped runtime admin (`saleemqozeem6@gmail.com`) can read or write to `/admins`. Users cannot self-assign the admin role.

## 2. The "Dirty Dozen" Malicious Payloads

1. **Payload 1 (Ghost Field in Product)**: A client injects an unknown shadow property `isFree: true` on `/products`. Rejected by strict key validation.
2. **Payload 2 (Unauthenticated Product Deletion)**: A public user attempts to delete a core mattress product. Rejected because `request.auth == null`.
3. **Payload 3 (Negative Price Attack)**: An attacker attempts to set a product price to `-50000`. Rejected by value boundary validation.
4. **Payload 4 (Massive 1MB String Denial of Wallet)**: An attacker injects a 500KB string into product title or inquiry message. Rejected by `.size() <= MAX` guards.
5. **Payload 5 (Unauthenticated Inquiry Scraping)**: A non-admin attempts to `list` the `/inquiries` collection to harvest customer phone numbers. Rejected by `isAdmin()` check.
6. **Payload 6 (Unauthorized Inquiry Modification)**: A non-admin attempts to update inquiry status or message. Rejected by `isAdmin()` requirement.
7. **Payload 7 (Self-Elevating Admin Write)**: A standard user attempts to write their own UID document to `/admins/{uid}` with `role: 'superadmin'`. Rejected because non-admins cannot write to `/admins`.
8. **Payload 8 (Inquiry Status Bypass)**: A public user attempts to submit an inquiry already marked as `status: 'completed'`. Rejected because initial status must be `'new'`.
9. **Payload 9 (Service Index Poisoning)**: An attacker submits an unverified service payload missing required `title` or `iconName`. Rejected by schema validation.
10. **Payload 10 (Document ID Path Traversal / Poisoning)**: An attacker targets a document with special characters `../../config` or 1KB length. Rejected by `isValidId()` regex `^[a-zA-Z0-9_\-]+$` and size `<= 128`.
11. **Payload 11 (Spoofed Email Admin Token)**: An attacker with unverified email claims to be `saleemqozeem6@gmail.com` with `email_verified == false`. Rejected by token verification.
12. **Payload 12 (Global Catch-All Probe)**: An attacker queries a random non-existent collection `/internal_system`. Rejected by `match /{document=**} { allow read, write: if false; }`.
