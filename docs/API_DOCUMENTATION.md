# ADMIRE PLATFORM - API DOCUMENTATION

**Backend API Reference for Developers**

---

## Base URL
```
https://api.admire.com.br/api
Development: http://localhost:3000/api
```

## Authentication
All endpoints require `Authorization: Bearer {accessToken}` except public routes.

---

## 📚 Endpoints

### AUTH ROUTES

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!@#",
  "firstName": "João",
  "lastName": "Silva",
  "cpf": "12345678900",
  "userType": "creator", // or "subscriber"
  "phoneNumber": "11987654321"
}

Response 201:
{
  "message": "Registration successful",
  "user": { id, email, firstName, userType, isVerified },
  "accessToken": "jwt_token",
  "refreshToken": "jwt_refresh_token"
}
```

#### Login
```
POST /auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!@#"
}

Response 200: { user, accessToken, refreshToken }
```

#### Request Age Verification
```
POST /auth/request-age-verification
Authorization: Bearer {token}

Response 200:
{
  "inquiryId": "inq_xxxxx",
  "redirectUrl": "https://verify.persona.com?inquiry-id=..."
}
```

#### Verify Age
```
POST /auth/verify-age
Authorization: Bearer {token}

{
  "verificationMethod": "id_selfie",
  "providerId": "persona"
}

Response 200: { message, user }
```

---

### USER ROUTES

#### Get Profile
```
GET /users/profile/{userId}

Response 200:
{
  "id": "user_id",
  "username": "johndoe",
  "firstName": "João",
  "bio": "Creator description",
  "profileImage": "https://...",
  "userType": "CREATOR",
  "isVerified": true,
  "creatorProfile": { ... }
}
```

#### Get My Profile
```
GET /users/me
Authorization: Bearer {token}

Response 200: { Full user object with auth details }
```

#### Update Profile
```
PUT /users/profile
Authorization: Bearer {token}

{
  "firstName": "New Name",
  "bio": "New bio",
  "profileImageUrl": "https://..."
}

Response 200: { message, user }
```

#### Search Users
```
GET /users/search?q=john&limit=10

Response 200: [ { id, username, profileImage, userType, isVerified } ]
```

#### Block User
```
POST /users/block/{userIdToBlock}
Authorization: Bearer {token}

{ "reason": "Harassment" }

Response 200: { message }
```

#### Get Blocked List
```
GET /users/blocked-list
Authorization: Bearer {token}

Response 200: [ { blockerId, blockedUserId, blockedUser: {...} } ]
```

---

### CREATOR ROUTES

#### Get Creator Profile
```
GET /creators/{creatorId}

Response 200:
{
  "id": "profile_id",
  "userId": "creator_id",
  "user": { ... creator user data },
  "verifiedBadge": true,
  "followerCount": 150,
  "contentCount": 42,
  "subscriptionTiers": [ ... ]
}
```

#### Submit KYC
```
POST /creators/kyc/submit
Authorization: Bearer {token}

{
  "idDocumentUrl": "data:image/jpeg;base64,/9j/4AAQ...",
  "selfieUrl": "data:image/jpeg;base64,/9j/4AAQ..."
}

Response 200: { message, kycStatus: "SUBMITTED" }
```

#### Get KYC Status
```
GET /creators/kyc/status
Authorization: Bearer {token}

Response 200:
{
  "id": "user_id",
  "kycStatus": "APPROVED",
  "verificationStatus": "APPROVED",
  "isVerified": true,
  "kycApprovedAt": "2026-01-15T10:30:00Z"
}
```

#### Create Subscription Tier
```
POST /creators/tiers
Authorization: Bearer {token}

{
  "name": "Basic Access",
  "description": "Monthly access to photos",
  "price": 19.90,
  "frequency": "monthly"
}

Response 201: { message, tier }
```

#### Get Creator's Tiers
```
GET /creators/{creatorId}/tiers

Response 200:
[
  {
    "id": "tier_id",
    "name": "Basic",
    "price": 19.90,
    "frequency": "monthly",
    "isActive": true
  }
]
```

#### Get Creator Stats
```
GET /creators/{creatorId}/stats

Response 200:
{
  "creatorId": "id",
  "followerCount": 150,
  "contentCount": 42,
  "activeSubscribers": 25,
  "totalEarnings": 5420.50,
  "averageRating": 4.8,
  "verifiedBadge": true
}
```

---

### CONTENT ROUTES

#### Upload Content
```
POST /content/upload
Authorization: Bearer {token}

{
  "title": "Content Title",
  "description": "Detailed description",
  "mediaUrl": "data:image/jpeg;base64,...",
  "thumbnail": "data:image/jpeg;base64,...",
  "type": "PHOTO",
  "accessType": "SUBSCRIPTION",
  "price": null,
  "consentFormUrl": "/templates/consent-form.pdf",
  "creatorDeclaresLegality": true
}

Response 201:
{
  "message": "Content uploaded. Pending moderation.",
  "content": { id, title, moderationStatus: "PENDING" }
}
```

#### Get Content Details
```
GET /content/{contentId}

Response 200:
{
  "id": "content_id",
  "title": "Content Title",
  "description": "Description",
  "mediaUrl": "https://s3.amazonaws.com/...",
  "type": "PHOTO",
  "accessType": "SUBSCRIPTION",
  "moderationStatus": "APPROVED",
  "viewCount": 234,
  "creator": { ... }
}
```

#### Get Creator's Feed
```
GET /content/creator/{creatorId}/feed?skip=0&limit=20

Response 200:
{
  "content": [ ... content array ],
  "pagination": { total: 100, skip: 0, limit: 20 }
}
```

#### Search Content
```
GET /content/search?q=fitness&creatorId=...&type=VIDEO&skip=0&limit=20

Response 200: { content, pagination }
```

#### Delete Content
```
DELETE /content/{contentId}
Authorization: Bearer {token}

Response 200: { message }
```

---

### SUBSCRIPTION ROUTES

#### Subscribe to Tier
```
POST /subscriptions/subscribe
Authorization: Bearer {token}

{
  "tierId": "tier_id",
  "paymentMethodId": "payment_method_id"
}

Response 201:
{
  "message": "Subscription successful",
  "subscription": { id, tierId, status: "ACTIVE", renewalDate }
}
```

#### Get My Subscriptions
```
GET /subscriptions/my-subscriptions
Authorization: Bearer {token}

Response 200:
[
  {
    "id": "sub_id",
    "tierId": "tier_id",
    "status": "ACTIVE",
    "renewalDate": "2026-02-15T...",
    "tier": { name, price },
    "creator": { user: { username, profileImage } }
  }
]
```

#### Cancel Subscription
```
POST /subscriptions/{subscriptionId}/cancel
Authorization: Bearer {token}

Response 200: { message }
```

#### Get Creator's Subscribers
```
GET /subscriptions/{creatorId}/subscribers?skip=0&limit=20
Authorization: Bearer {token}

Response 200:
{
  "subscribers": [
    {
      "subscriber": { id, username, profileImage },
      "tier": { name, price },
      "subscribedAt": "..."
    }
  ],
  "pagination": { total, skip, limit }
}
```

#### Purchase Content
```
POST /subscriptions/purchase/{contentId}
Authorization: Bearer {token}

Response 201: { message, purchase }
```

---

### MESSAGE ROUTES

#### Send Message
```
POST /messages/send
Authorization: Bearer {token}

{
  "recipientId": "user_id",
  "content": "Hello there!",
  "isPaid": false,
  "price": null
}

Response 201: { message, data: { id, content, createdAt } }
```

#### Get Conversation
```
GET /messages/conversation/{otherUserId}?skip=0&limit=50
Authorization: Bearer {token}

Response 200:
{
  "messages": [ { id, content, createdAt, sender, isRead } ],
  "pagination": { skip, limit }
}
```

#### Get Inbox
```
GET /messages/inbox
Authorization: Bearer {token}

Response 200:
[
  {
    "user": { id, username, profileImage },
    "lastMessage": { content, createdAt },
    "unreadCount": 3
  }
]
```

#### Mark as Read
```
PUT /messages/{messageId}/read
Authorization: Bearer {token}

Response 200: { message }
```

---

### COMPLAINT ROUTES

#### File Complaint
```
POST /complaints/report
Authorization: Bearer {token}

{
  "contentId": "content_id",
  "reason": "MINOR_INVOLVED",
  "description": "This content appears to have a minor",
  "urgency": "CRITICAL"
}

Response 201:
{
  "message": "Complaint submitted",
  "complaint": { id, status: "OPEN", urgency: "CRITICAL" }
}
```

#### List Complaints (Admin)
```
GET /complaints?status=OPEN&urgency=CRITICAL&skip=0&limit=20
Authorization: Bearer {admin_token}

Response 200: { complaints, pagination }
```

#### Resolve Complaint (Admin)
```
PUT /complaints/{complaintId}/resolve
Authorization: Bearer {admin_token}

{
  "action": "removed",
  "notes": "Content removed - minor involvement suspected"
}

Response 200: { message, complaint }
```

#### Appeal Complaint
```
POST /complaints/{complaintId}/appeal
Authorization: Bearer {token}

{
  "appealReason": "This decision was wrong because..."
}

Response 200: { message, complaint: { status: "APPEALED" } }
```

---

### PAYMENT ROUTES

#### Initialize Payment
```
POST /payments/initialize
Authorization: Bearer {token}

{
  "amount": 19.90,
  "currency": "BRL",
  "description": "Subscription - Basic Tier",
  "type": "SUBSCRIPTION_PAYMENT",
  "referenceId": "sub_id"
}

Response 200:
{
  "paymentId": "pay_xxxxx",
  "redirectUrl": "https://payment.verotel.com/...",
  "message": "Redirect user to complete payment"
}
```

#### Payment Webhook (Internal)
```
POST /payments/webhook/success
Content-Type: application/json

{
  "paymentId": "pay_xxxxx",
  "userId": "user_id",
  "amount": 19.90,
  "currency": "BRL",
  "type": "SUBSCRIPTION_PAYMENT"
}

Response 200: { message, transactionId }
```

#### Get Wallet Balance
```
GET /payments/wallet/balance
Authorization: Bearer {token}

Response 200:
{
  "userId": "user_id",
  "balance": 5420.50,
  "lastUpdated": "2026-01-15T10:30:00Z"
}
```

#### Get Transaction History
```
GET /payments/transactions/history?skip=0&limit=50&type=EARNINGS_DEPOSIT
Authorization: Bearer {token}

Response 200:
{
  "transactions": [
    {
      "id": "trans_id",
      "type": "EARNINGS_DEPOSIT",
      "amount": 150.00,
      "description": "Subscription payment",
      "status": "COMPLETED",
      "createdAt": "..."
    }
  ],
  "pagination": { total, skip, limit }
}
```

#### Request Withdrawal
```
POST /payments/withdrawal/request
Authorization: Bearer {token}

{
  "amount": 1000.00,
  "bankAccountId": "account_id"
}

Response 200:
{
  "message": "Withdrawal request submitted",
  "withdrawal": { id, amount, status: "PENDING" }
}
```

---

### MODERATION ROUTES (Admin Only)

#### Get Moderation Queue
```
GET /moderation/queue?skip=0&limit=20&urgency=critical
Authorization: Bearer {admin_token}

Response 200: { content: [...], pagination: {...} }
```

#### Review Content
```
PUT /moderation/review/{contentId}
Authorization: Bearer {admin_token}

{
  "decision": "APPROVED",
  "notes": "Content meets guidelines",
  "containsMinors": false
}

Response 200: { message, content }
```

#### Analyze Content
```
POST /moderation/analyze/{contentId}
Authorization: Bearer {admin_token}

Response 200:
{
  "contentId": "id",
  "analysisResult": {
    "flagged": false,
    "labels": ["adult", "explicit"],
    "confidence": 95.5
  },
  "recommendation": "Appears compliant"
}
```

#### Get Moderation Stats
```
GET /moderation/stats
Authorization: Bearer {admin_token}

Response 200:
{
  "pending": 23,
  "underReview": 5,
  "approved": 1240,
  "flagged": 12,
  "removed": 8,
  "totalComplaints": 45,
  "openComplaints": 8,
  "criticalComplaints": 2
}
```

#### Get Audit Logs
```
GET /moderation/audit-logs?skip=0&limit=100&action=content_removed
Authorization: Bearer {admin_token}

Response 200: { logs, pagination }
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid email format"
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Only creators can access this resource"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 500 Server Error
```json
{
  "error": {
    "message": "Internal Server Error",
    "status": 500,
    "timestamp": "2026-01-15T10:30:00Z"
  }
}
```

---

## Rate Limits

- **General**: 100 requests per 15 minutes per IP
- **Auth**: 5 login attempts per 15 minutes per IP
- **API**: 1000 requests per hour per user

---

## Testing

### cURL Examples

**Register**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!@#",
    "firstName": "Test",
    "lastName": "User",
    "cpf": "12345678900",
    "userType": "subscriber"
  }'
```

**Get Profile**:
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**For full integration examples, see** `/examples` folder.

