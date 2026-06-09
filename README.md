# ADMIRE PLATFORM - Setup & Deployment Guide

**Production-Ready Adult Content Platform for Brazil (2026)**

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- PostgreSQL 16
- Redis 7
- Git

### 1. Clone & Install

```bash
# Clone repository
git clone <repo-url>
cd admire-platform

# Install root dependencies
yarn install

# Install workspace dependencies
yarn workspaces run install
```

### 2. Environment Setup

```bash
# Backend
cp packages/backend/.env.example packages/backend/.env
# Edit with your values:
# - JWT_SECRET (min 32 chars)
# - DATABASE_URL
# - AWS credentials
# - Payment processor keys
# - Persona verification API key

# Frontend
cp packages/frontend/.env.local.example packages/frontend/.env.local
# Edit API_URL to match backend
```

### 3. Database Setup

```bash
# Generate Prisma client
yarn workspace admire-backend prisma generate

# Run migrations
yarn workspace admire-backend prisma migrate dev --name init

# Seed sample data (optional)
yarn workspace admire-backend prisma db seed
```

### 4. Run Development

```bash
# Start all services with Docker
docker-compose up -d

# Or run locally
yarn dev  # Starts backend + frontend in parallel
```

Access:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api
- **API Docs**: http://localhost:3000/api-docs (Swagger - optional)

---

## 📦 Production Deployment

### AWS EC2 / VPS Setup

```bash
# 1. SSH to server
ssh -i your-key.pem ubuntu@your-domain

# 2. Install Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 3. Clone & configure
git clone <repo-url>
cd admire-platform
cp packages/backend/.env.example packages/backend/.env
# Edit .env with production values!

# 4. Build & deploy
docker-compose -f docker-compose.prod.yml up -d

# 5. Configure SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d yourdomain.com.br
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/admire.com.br

server {
    listen 443 ssl http2;
    server_name admire.com.br www.admire.com.br;

    ssl_certificate /etc/letsencrypt/live/admire.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admire.com.br/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_buffering off;
        proxy_request_buffering off;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
    limit_req zone=api burst=20 nodelay;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name admire.com.br www.admire.com.br;
    return 301 https://$server_name$request_uri;
}
```

---

## 🔐 Security Checklist

- [ ] Change all default passwords
- [ ] Enable SSL/TLS (Let's Encrypt)
- [ ] Configure firewall (UFW):
  ```bash
  sudo ufw default deny incoming
  sudo ufw default allow outgoing
  sudo ufw allow 22/tcp
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw enable
  ```
- [ ] Setup WAF (Cloudflare, AWS WAF)
- [ ] Enable 2FA on admin accounts
- [ ] Setup backups (automated daily)
- [ ] Configure logging & monitoring
- [ ] GDPR/LGPD audit ready
- [ ] Intrusion detection (fail2ban)

### Database Backups

```bash
# Automated daily backup
0 2 * * * docker exec admire-postgres pg_dump -U admire_user admire_platform | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz
```

---

## 💳 Payment Integration

### Verotel (Recommended for Adult Content)

```javascript
// packages/backend/src/services/verotel.ts
import axios from 'axios'

export const initializeVerotelPayment = async (amount: number, currency: string) => {
  const response = await axios.post('https://www.verotel.com/api/v1/pay', {
    shopID: process.env.VEROTEL_SHOP_ID,
    amount: Math.round(amount * 100), // Cents
    currency: currency,
    description: 'Admire Platform Subscription',
    redirectUrl: `${process.env.FRONTEND_URL}/payment-success`,
    failUrl: `${process.env.FRONTEND_URL}/payment-failed`,
    notifyUrl: `${process.env.BACKEND_URL}/api/payments/webhook/verotel`
  }, {
    auth: {
      username: process.env.VEROTEL_USERNAME,
      password: process.env.VEROTEL_PASSWORD
    }
  })

  return response.data
}
```

### Alternative: CCBill

```javascript
// Similar pattern for CCBill
const ccbillUrl = `https://bill.ccbill.com/jpost.html?clientAccnum=${CCBILL_ACCT}&clientSubacc=${CCBILL_SUBACC}&amount=${amount}`
```

---

## 🔍 Moderation & Content Detection

### AWS Rekognition Integration

```typescript
// packages/backend/src/services/rekognition.ts
import { RekognitionClient, DetectLabelsCommand } from "@aws-sdk/client-rekognition";

export const analyzeContent = async (s3Key: string) => {
  const client = new RekognitionClient({ region: process.env.AWS_S3_REGION });
  
  const command = new DetectLabelsCommand({
    Image: {
      S3Object: {
        Bucket: process.env.AWS_S3_BUCKET,
        Name: s3Key
      }
    },
    MinConfidence: 80
  });

  const response = await client.send(command);
  
  // Check for dangerous labels
  const dangerousLabels = response.Labels?.filter(l => 
    ['Person', 'Child', 'Baby', 'Face'].includes(l.Name)
  );

  return {
    flagged: dangerousLabels?.length > 0,
    labels: response.Labels,
    confidence: response.Labels?.[0]?.Confidence
  };
};
```

---

## 📱 Age Verification (Persona.com)

```typescript
// packages/backend/src/services/persona.ts
import axios from 'axios'

export const createPersonaInquiry = async (userId: string) => {
  const response = await axios.post('https://api.withpersona.com/api/v1/inquiries', {
    data: {
      type: 'inquiry',
      attributes: {
        'inquiry-template-id': 'tmpl_aGLV39Ej2sHrVBcX9j7x3cV7', // Age verification template
        'reference-id': userId
      }
    }
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.PERSONA_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data.data.attributes['redirect-url'];
};

// Webhook handler
export const handlePersonaWebhook = async (inquiry: any) => {
  if (inquiry.status === 'approved') {
    // Mark user as age-verified
    await prisma.user.update({
      where: { id: inquiry.referenceId },
      data: { ageVerifiedAt: new Date() }
    });
  }
};
```

---

## 📊 Monitoring & Logging

```bash
# Docker logs
docker logs -f admire-backend
docker logs -f admire-frontend

# Monitor containers
docker stats

# Database backups check
ls -la /backups/
```

### Sentry Error Tracking

```typescript
// packages/backend/src/index.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

---

## 🇧🇷 Brazil Compliance

### LGPD (Lei 13.709/2018)
- ✅ Explicit user consent collected
- ✅ Privacy policy in Portuguese
- ✅ Data deletion requests (within 15 days)
- ✅ Encrypted storage of sensitive data
- ✅ Data breach notification (within 48 hours)

### Digital ECA (Lei 15.211/2025)
- ✅ Robust age verification (not just click)
- ✅ Parental controls option
- ✅ Child protection mechanisms
- ✅ Content warning labels

### Data Protection
```typescript
// Encrypt sensitive fields
import crypto from 'crypto'

const encryptCPF = (cpf: string) => {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  return cipher.update(cpf, 'utf8', 'hex') + cipher.final('hex');
};

const decryptCPF = (encryptedCpf: string) => {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  return decipher.update(encryptedCpf, 'hex', 'utf8') + decipher.final('utf8');
};
```

---

## 🧪 Testing

```bash
# Backend tests
yarn workspace admire-backend test

# Frontend tests
yarn workspace admire-frontend test

# E2E tests
yarn test:e2e
```

---

## 📞 Support & Compliance

**Support Email**: support@admire.com.br
**Compliance Email**: compliance@admire.com.br
**Legal Notices**: See `/docs` folder

---

## 📄 Legal Documents

All required documents included:
- `TERMOS_DE_USO_PT_BR.md` - Terms of Use
- `POLITICA_CONTEUDO_ADULTO_PT_BR.md` - Adult Content Policy
- `POLITICA_PRIVACIDADE_LGPD.md` - Privacy Policy (LGPD)
- `FORMULARIO_CONSENTIMENTO_DIGITAL.md` - Consent Form Template

---

## License

This project is proprietary and confidential.

---

**Last Updated**: 2025
**Version**: 1.0.0
