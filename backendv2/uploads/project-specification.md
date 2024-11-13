# Furious Warrior
## Technical Specification & Pricing Document
*Last Updated: November 12, 2024*

## 1. Project Overview
Furious Warrior is a full-stack e-commerce and service platform designed to sell products and provide career counseling services. The platform includes content management, payment processing, and user management capabilities.

### 1.1 Core Features
- Product/Service Sales
- Career Counseling Booking
- Content Management System
- User Authentication & Management
- Payment Processing
- Order Management
- Admin Dashboard
- Newsletter Integration
- Analytics & Reporting

## 2. Technical Architecture

### 2.1 Frontend Technology Stack
- **Framework**: Next.js 14
- **Styling**: TailwindCSS
- **State Management**: React Query
- **Hosting**: Vercel
- **Analytics**: Vercel Analytics

### 2.2 Backend Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon)
- **File Storage**: AWS S3
- **Hosting**: AWS ECS (Fargate)
- **API Documentation**: Swagger

### 2.3 Third-Party Services
- **Payment Gateway**: Stripe
- **Email Service**: AWS SES
- **Newsletter**: Beehiiv Integration
- **Scheduling**: Calendly
- **SSL**: Let's Encrypt
- **Monitoring**: AWS CloudWatch

## 3. Infrastructure Details

### 3.1 Computing Resources
- **Frontend**: Vercel Pro Plan
  - Global Edge Network
  - Automatic HTTPS
  - Preview Deployments
  - Team Collaboration

- **Backend**: AWS ECS Fargate
  - 2 Tasks (0.5 vCPU, 1GB RAM each)
  - Application Load Balancer
  - Auto-scaling enabled

### 3.2 Storage & Database
- **File Storage**: AWS S3
  - Separate buckets for public/private assets
  - Lifecycle policies for cost optimization
  - Expected storage: 50GB initially

- **Database**: Neon PostgreSQL
  - 1 Compute Unit
  - Auto-scaling storage
  - Daily backups
  - Connection pooling

## 4. Monthly Operating Costs

### 4.1 Infrastructure Costs
| Service | Specification | Monthly Cost |
|---------|--------------|--------------|
| Vercel (Frontend) | Pro Plan | $20 |
| AWS ECS (Backend) | 2 Fargate tasks | $35 |
| Load Balancer | Application LB | $16.50 |
| AWS S3 | 50GB + Transfer | $20 |
| Neon Database | Pro Plan | $25 |
| **Total Infrastructure** | | **$116.50** |

### 4.2 Third-Party Service Costs
| Service | Plan | Monthly Cost |
|---------|------|--------------|
| Stripe | 2.9% + $0.30 per transaction | Variable |
| AWS SES | $0.10 per 1000 emails | ~$10 |
| Calendly | Team Plan | $12 |
| **Total Services** | | **$22+** |

### 4.3 Development & Maintenance
| Service | Description | Monthly Cost |
|---------|-------------|--------------|
| Bug Fixes | Ongoing maintenance | Included |
| Security Updates | Regular updates | Included |
| Performance Monitoring | 24/7 monitoring | Included |
| **Total Support** | | **Included** |

## 5. Scaling Considerations

### 5.1 Traffic Capacity
- Designed for 5,000 daily visitors
- Auto-scaling triggers at 80% resource utilization
- Burst capacity up to 15,000 daily visitors

### 5.2 Storage Scaling
- Initial S3 storage: 50GB
- Database storage: Auto-scaling enabled
- CDN caching for static assets

## 6. Service Level Agreement (SLA)

### 6.1 Uptime Guarantee
- Platform Availability: 99.9%
- Maximum Monthly Downtime: 43 minutes
- Planned Maintenance: Excluded from SLA

### 6.2 Support Response Times
- Critical Issues: 2 hours
- Major Issues: 4 hours
- Minor Issues: 24 hours

## 7. Security Measures

### 7.1 Data Protection
- SSL/TLS encryption
- Data encryption at rest
- Regular security audits
- GDPR compliance measures

### 7.2 Backup Policy
- Database: Daily backups (7-day retention)
- S3: Version control enabled
- Configuration: Daily backups

## 8. Maintenance & Updates

### 8.1 Regular Maintenance
- Weekly security patches
- Monthly dependency updates
- Quarterly performance reviews

### 8.2 Emergency Maintenance
- 24/7 monitoring
- Automated alerting
- Emergency response team

## 9. Total Cost of Ownership

### 9.1 Monthly Recurring Costs
| Category | Cost |
|----------|------|
| Infrastructure | $116.50 |
| Third-Party Services | $22+ |
| Support & Maintenance | Included |
| **Total Monthly Cost** | **$138.50+** |

### 9.2 One-Time Costs
| Item | Cost |
|------|------|
| Domain Registration | ~$15/year |
| SSL Certificate | Included |
| Initial Setup | Included |

## 10. Terms & Conditions

### 10.1 Payment Terms
- Monthly billing
- Net 30 payment terms
- Auto-renewal enabled

### 10.2 Contract Terms
- Minimum 12-month commitment
- 60-day cancellation notice
- No hidden fees

### 10.3 Service Modifications
- 30-day notice for pricing changes
- Service modifications as needed
- Regular feature updates

---

*Note: All prices are in USD and subject to change based on usage patterns and service provider adjustments. Variable costs like Stripe fees are not included in the total.*
