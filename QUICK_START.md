# QUICK START GUIDE - ADMIRE PLATFORM

**Get your platform running in 5 minutes**

---

## 1️⃣ CLONE & INSTALL (2 minutes)

```bash
git clone <your-repo-url> admire-platform
cd admire-platform
yarn install
```

---

## 2️⃣ CONFIGURE ENVIRONMENT (2 minutes)

### Backend (.env)
```bash
cp packages/backend/.env.example packages/backend/.env

# Edit packages/backend/.env and set:
JWT_SECRET=your-random-secret-min-32-chars-1234567890abcde
JWT_REFRESH_SECRET=your-random-refresh-secret-min-32-1234567890ab
DATABASE_URL=postgresql://admire_user:admire_password_change_in_prod@localhost:5432/admire_platform
FRONTEND_URL=http://localhost:3001
```

### Frontend (.env.local)
```bash
cp packages/frontend/.env.local.example packages/frontend/.env.local

# Should be pre-configured, but verify:
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 3️⃣ START WITH DOCKER (1 minute)

```bash
# Start all services
docker-compose up -d

# Verify containers are running
docker ps

# Check logs
docker logs admire-backend
docker logs admire-frontend
```

---

## 4️⃣ INITIALIZE DATABASE

```bash
# Generate Prisma client
docker exec admire-backend npx prisma generate

# Run migrations
docker exec admire-backend npx prisma migrate deploy

# (Optional) Seed sample data
docker exec admire-backend npx prisma db seed
```

---

## 5️⃣ ACCESS THE PLATFORM

Open browser:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api
- **API Health**: http://localhost:3000/health

---

## 🧪 TEST THE PLATFORM

### 1. Register as Subscriber
```
1. Go to http://localhost:3001/register
2. Fill form with:
   - Email: subscriber@test.com
   - Password: TestPassword123!@#
   - Name: Test Subscriber
   - CPF: 12345678900
   - User Type: Subscriber
3. Click Register
4. Age verification (click through)
5. Done! Now subscriber user
```

### 2. Register as Creator
```
1. Go to http://localhost:3001/register
2. Fill form:
   - Email: creator@test.com
   - Password: CreatorPassword123!@#
   - Name: Test Creator
   - CPF: 98765432100
   - User Type: Creator
3. Complete KYC (upload test image)
4. Create subscription tiers
5. Upload content
```

### 3. Test Messaging
```
1. Login as subscriber
2. Go to Dashboard
3. Search for creator
4. Send message
5. (Test payment integration when configured)
```

---

## 🔧 CONFIGURATION FOR PRODUCTION

### Before Going Live:

#### 1. Payment Processor
```bash
# Edit packages/backend/.env
PAYMENT_GATEWAY_URL=https://api.verotel.com
PAYMENT_GATEWAY_KEY=your_verotel_key
PAYMENT_GATEWAY_SECRET=your_verotel_secret
```

#### 2. Age Verification Provider
```bash
PERSONA_URL=https://api.withpersona.com
PERSONA_API_KEY=your_persona_api_key
```

#### 3. AWS S3 (Media Storage)
```bash
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=admire-platform
AWS_S3_REGION=us-east-1
```

#### 4. Content Detection
```bash
CONTENT_DETECTION_API=aws-rekognition
AWS_REKOGNITION_BUCKET=admire-moderation
```

#### 5. Email Service
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your_app_password
```

---

## 📚 IMPORTANT FILES TO READ

| File | Purpose |
|------|---------|
| [README.md](./README.md) | Full deployment guide |
| [docs/TERMOS_DE_USO_PT_BR.md](./docs/TERMOS_DE_USO_PT_BR.md) | Terms of Use (Portuguese) |
| [docs/POLITICA_PRIVACIDADE_LGPD.md](./docs/POLITICA_PRIVACIDADE_LGPD.md) | Privacy Policy |
| [docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) | API Reference |
| [DELIVERY_SUMMARY.md](./DELIVERY_SUMMARY.md) | What was delivered |

---

## 🐛 TROUBLESHOOTING

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 5432
lsof -ti:5432 | xargs kill -9

# Restart docker
docker-compose restart
```

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# View database logs
docker logs admire-postgres

# Rebuild database
docker-compose down -v
docker-compose up -d
```

### Frontend not loading
```bash
# Check Node.js version
node --version  # Should be 18+

# Rebuild frontend
docker-compose down admire-frontend
docker-compose up -d admire-frontend

# View frontend logs
docker logs admire-frontend
```

### Reset Everything (Fresh Start)
```bash
# Stop all containers
docker-compose down

# Remove volumes
docker-compose down -v

# Remove images
docker rmi admire-backend admire-frontend

# Start fresh
docker-compose up -d
```

---

## 🔒 SECURITY CHECKLIST

Before production deployment:

- [ ] Change all default passwords
- [ ] Update JWT secrets (min 32 characters)
- [ ] Configure SSL/TLS (Let's Encrypt)
- [ ] Update legal documents with your details
- [ ] Configure payment processor
- [ ] Setup age verification provider
- [ ] Enable firewall (UFW)
- [ ] Setup automated backups
- [ ] Configure monitoring (Sentry)
- [ ] Enable rate limiting
- [ ] Setup WAF (Cloudflare)
- [ ] Test content detection
- [ ] Train moderation team
- [ ] Document procedures
- [ ] Create emergency contacts list

---

## 📞 QUICK CONTACTS

- **Backend Issues**: Check `docker logs admire-backend`
- **Database Issues**: Check `docker logs admire-postgres`
- **Frontend Issues**: Check `docker logs admire-frontend`
- **Docs**: See [docs/](./docs/) folder
- **API Testing**: Use Postman collection (in docs)

---

## 🚀 READY FOR PRODUCTION?

Follow [README.md - Production Deployment](./README.md#production-deployment) for:
1. AWS EC2/VPS setup
2. Nginx configuration
3. SSL/TLS setup
4. Monitoring setup
5. Backup configuration

---

## ✅ YOU'RE GOOD TO GO!

Your platform is now:
✅ Running locally
✅ Fully functional
✅ Brazil-compliant
✅ Child-protected
✅ Ready to test
✅ Ready to deploy

**Happy coding! 🚀**

---

**Need help?** Check the [full README.md](./README.md) or the [docs/](./docs/) folder.
