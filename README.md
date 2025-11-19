# BeeHive Deployment Guide 🐝

Complete step-by-step guide to deploy the BeeHive dashboard from an empty Raspberry Pi to a fully functional web application accessible from anywhere.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Phase 1: Raspberry Pi Setup](#phase-1-raspberry-pi-setup)
- [Phase 2: Development Environment](#phase-2-development-environment)
- [Phase 3: Backend Deployment](#phase-3-backend-deployment)
- [Phase 4: External Access Setup](#phase-4-external-access-setup)
- [Phase 5: Frontend Deployment](#phase-5-frontend-deployment)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)

## Prerequisites

### Hardware Requirements
- **Raspberry Pi 2 Model B** (or newer)
- **64GB SD Card** (minimum 32GB)
- **Stable internet connection**
- **Power supply** for Raspberry Pi

### Software Requirements
- **Mac/PC** for development
- **SSH client** (Terminal on Mac, PuTTY on Windows)
- **Java 17** on development machine
- **Node.js 18+** for frontend development

### Account Requirements
- **Cloudflare account** (free tier)
- **Vercel account** (free tier, optional)

---

## Phase 1: Raspberry Pi Setup

### Step 1.1: Install Raspberry Pi OS

1. **Download Raspberry Pi Imager**
   ```bash
   # From https://www.raspberrypi.org/software/
   ```

2. **Flash Raspberry Pi OS 32-bit Legacy** (lightweight for Pi 2 Model B)
   - Choose "Raspberry Pi OS (Legacy, 32-bit) Lite"
   - Enable SSH in advanced options
   - Set username and password
   - Configure WiFi if needed

3. **Boot the Pi and find its IP address**
   ```bash
   # Check your router's admin panel or use:
   nmap -sn 192.168.1.0/24  # Replace with your network range
   ```

### Step 1.2: Initial Pi Configuration

```bash
# SSH into your Pi
ssh username@PI_IP_ADDRESS

# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git vim
```

### Step 1.3: Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install -y docker-compose

# Logout and login again for group changes
exit
ssh username@PI_IP_ADDRESS

# Verify Docker installation
docker --version
docker-compose --version
```

### Step 1.4: Install Portainer (Optional)

```bash
# Create portainer volume
docker volume create portainer_data

# Run Portainer
docker run -d \
  -p 8000:8000 -p 9443:9443 \
  --name portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest

# Access Portainer at https://PI_IP_ADDRESS:9443
```

### Step 1.5: Install Java 17

```bash
# Install Java 17
sudo apt install -y openjdk-17-jdk

# Verify installation
java -version
```

---

## Phase 2: Development Environment

### Step 2.1: Project Structure Setup

On your development machine (Mac), ensure your project structure:

```
BeeHive/
├── docker-compose.yml
├── .env
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
└── frontend/
    ├── package.json
    └── app/
```

### Step 2.2: Install Java 17 on Mac

```bash
# Install Java 17 with Homebrew
brew install openjdk@17

# Set JAVA_HOME
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify installation
java -version
```

### Step 2.3: Create Docker Configuration Files

#### Dockerfile (backend/Dockerfile)
```dockerfile
FROM adoptopenjdk/openjdk11:armv7l-ubuntu-jre-11.0.11_9

WORKDIR /app

COPY target/application-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

CMD ["java", "-Xmx512m", "-jar", "app.jar"]
```

#### Docker Compose (docker-compose.yml)
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: dashboard_postgres
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    networks:
      - dashboard_network
    restart: unless-stopped

  backend:
    build: ./backend
    container_name: dashboard_backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/${POSTGRES_DB}
      - SPRING_DATASOURCE_USERNAME=${POSTGRES_USER}
      - SPRING_DATASOURCE_PASSWORD=${POSTGRES_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
    networks:
      - dashboard_network
    restart: unless-stopped

  adminer:
    image: adminer
    container_name: dashboard_adminer
    restart: unless-stopped
    ports:
      - "8081:8080"
    networks:
      - dashboard_network

volumes:
  postgres_data:

networks:
  dashboard_network:
    driver: bridge
```

#### Production Properties (backend/src/main/resources/application-prod.properties)
```properties
spring.application.name=BeeHive

# Database configuration
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT configuration
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# Server configuration
server.port=8080

# Logging Configuration
logging.level.root=INFO
logging.level.com.beehive.dashboard=INFO
logging.file.name=/home/pi/beehive/logs/application.log
logging.file.max-size=10MB
logging.file.max-history=5
```

---

## Phase 3: Backend Deployment

### Step 3.1: Build and Transfer Application

```bash
# On Mac - Build the Spring Boot application
cd /path/to/BeeHive/backend
./mvnw clean package -DskipTests

# Create directory on Pi
ssh username@PI_IP_ADDRESS
mkdir -p /home/username/beehive/backend/target
mkdir -p /home/username/beehive/logs
exit

# Transfer files to Pi
scp target/application-0.0.1-SNAPSHOT.jar username@PI_IP_ADDRESS:/home/username/beehive/backend/target/
scp -r ../docker-compose.yml username@PI_IP_ADDRESS:/home/username/beehive/
scp -r ../.env username@PI_IP_ADDRESS:/home/username/beehive/
scp Dockerfile username@PI_IP_ADDRESS:/home/username/beehive/backend/
```

### Step 3.2: Setup Database

```bash
# SSH to Pi
ssh username@PI_IP_ADDRESS
cd /home/username/beehive

# Start PostgreSQL container
docker run -d \
  --name dashboard_postgres \
  -e POSTGRES_DB=dashboard_db \
  -e POSTGRES_USER=dashboard_user \
  -e POSTGRES_PASSWORD=dashboard_password \
  -p 5432:5432 \
  --restart unless-stopped \
  postgres:15-alpine

# Verify PostgreSQL is running
docker ps
docker logs dashboard_postgres
```

### Step 3.3: Run Spring Boot Application

```bash
# Set environment variables
export SPRING_PROFILES_ACTIVE=prod
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/dashboard_db
export SPRING_DATASOURCE_USERNAME=dashboard_user
export SPRING_DATASOURCE_PASSWORD=dashboard_password
export JWT_SECRET=${CREATE_SECRET}

# Run the application
cd /home/username/beehive/backend/target
java -Xmx512m -jar application-0.0.1-SNAPSHOT.jar

# Test locally
curl http://localhost:8080/health
curl http://localhost:8080/
```

### Step 3.4: Create Startup Script

```bash
# Create startup script
nano /home/username/start-beehive.sh
```

Add content:
```bash
#!/bin/bash
export SPRING_PROFILES_ACTIVE=prod
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/dashboard_db
export SPRING_DATASOURCE_USERNAME=dashboard_user
export SPRING_DATASOURCE_PASSWORD=dashboard_password
export JWT_SECRET=${CREATE_SECRET}

cd /home/username/beehive/backend/target
java -Xmx512m -jar application-0.0.1-SNAPSHOT.jar
```

```bash
# Make executable
chmod +x /home/username/start-beehive.sh
```

---

## Phase 4: External Access Setup

### Step 4.1: Install Cloudflared

```bash
# On Raspberry Pi
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm
sudo mv cloudflared-linux-arm /usr/local/bin/cloudflared
sudo chmod +x /usr/local/bin/cloudflared

# Verify installation
cloudflared --version
```

### Step 4.2: Create Cloudflare Tunnel Service

```bash
# Create systemd service for tunnel
sudo nano /etc/systemd/system/beehive-tunnel.service
```

Add configuration:
```ini
[Unit]
Description=BeeHive Cloudflare Tunnel
After=network.target

[Service]
Type=simple
User=${USER}
ExecStart=/usr/local/bin/cloudflared tunnel --url http://localhost:8080
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Step 4.3: Setup Backend Service

```bash
# Create systemd service for Spring Boot app
sudo nano /etc/systemd/system/beehive-app.service
```

Add configuration:
```ini
[Unit]
Description=BeeHive Spring Boot Application
After=postgresql.service

[Service]
Type=simple
User=${USER}
Environment=SPRING_PROFILES_ACTIVE=prod
Environment=SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/dashboard_db
Environment=SPRING_DATASOURCE_USERNAME=dashboard_user
Environment=SPRING_DATASOURCE_PASSWORD=dashboard_password
Environment=JWT_SECRET=${CREATE_SECRET}
ExecStart=/usr/bin/java -Xmx512m -jar /home/${USER}/beehive/backend/target/application-0.0.1-SNAPSHOT.jar
WorkingDirectory=/home/${USER}/beehive/backend/target
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Step 4.4: Enable and Start Services

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable services to start on boot
sudo systemctl enable beehive-app.service
sudo systemctl enable beehive-tunnel.service

# Start the services
sudo systemctl start beehive-app.service
sudo systemctl start beehive-tunnel.service

# Check status
sudo systemctl status beehive-app.service
sudo systemctl status beehive-tunnel.service

# View logs to get tunnel URL
sudo journalctl -u beehive-tunnel.service -f
```

### Step 4.5: Service Management Commands

```bash
# Start services
sudo systemctl start beehive-app.service
sudo systemctl start beehive-tunnel.service

# Stop services
sudo systemctl stop beehive-app.service
sudo systemctl stop beehive-tunnel.service

# Restart services
sudo systemctl restart beehive-app.service
sudo systemctl restart beehive-tunnel.service

# Check status
sudo systemctl status beehive-app.service
sudo systemctl status beehive-tunnel.service

# View logs
sudo journalctl -u beehive-app.service -f
sudo journalctl -u beehive-tunnel.service -f

# View tunnel URL
sudo journalctl -u beehive-tunnel.service | grep "Your quick Tunnel"
```

---

## Phase 5: Frontend Deployment

### Step 5.1: Update Frontend Configuration

```bash
# On Mac - Update environment variables
cd /path/to/BeeHive/frontend
echo "NEXT_PUBLIC_API_BASE_URL=https://your-tunnel-url.trycloudflare.com" > .env.production
```

### Step 5.2: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd /path/to/BeeHive/frontend
vercel --prod

# Follow prompts to deploy
```

### Step 5.3: Configure Environment Variables in Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - `NEXT_PUBLIC_API_BASE_URL`: `https://your-tunnel-url.trycloudflare.com`

---

## Troubleshooting

### Common Issues

#### 1. Java Version Mismatch
```bash
# Error: UnsupportedClassVersionError
# Solution: Ensure Java 17 on both development and deployment

# Check Java version
java -version

# Install correct version
sudo apt install openjdk-17-jdk
```

#### 2. Docker ARM Compatibility
```bash
# Error: no match for platform in manifest
# Solution: Use ARM-compatible images

# For Java 11 (recommended for Pi 2)
FROM adoptopenjdk/openjdk11:armv7l-ubuntu-jre-11.0.11_9

# For Java 17 (if available)
FROM arm32v7/openjdk:17-jdk-slim
```

#### 3. Database Connection Issues
```bash
# Check PostgreSQL status
docker ps
docker logs dashboard_postgres

# Restart if needed
docker restart dashboard_postgres

# Test connection
psql -h localhost -U dashboard_user -d dashboard_db
```

#### 4. Spring Security 403 Errors
```java
// Update SecurityConfig.java
.requestMatchers("/api/auth/**", "/actuator/**", "/", "/health").permitAll()
```

#### 5. Cloudflare Tunnel Issues
```bash
# Check tunnel status
cloudflared tunnel list

# Restart tunnel
sudo systemctl restart cloudflared

# Check logs
sudo journalctl -u cloudflared -f
```

### Memory Optimization for Raspberry Pi

```bash
# Optimize JVM memory usage
java -Xmx512m -Xms256m -XX:+UseG1GC -jar application.jar

# Monitor memory usage
htop
free -h
```

---

## Maintenance

### Daily Operations

#### Start Services
```bash
# Start PostgreSQL
docker start dashboard_postgres

# Start Spring Boot application
sudo systemctl start beehive-app.service

# Start tunnel
sudo systemctl start beehive-tunnel.service
```

#### Stop Services
```bash
# Stop Spring Boot
sudo systemctl stop beehive-app.service

# Stop PostgreSQL
docker stop dashboard_postgres

# Stop tunnel
sudo systemctl stop beehive-tunnel.service
```

#### Check Status
```bash
# Check application status
sudo systemctl status beehive-app.service

# Check database status
docker ps | grep postgres

# Check memory usage
free -h
htop
```

### Updates

#### Update Backend
```bash
# On Mac - rebuild
./mvnw clean package -DskipTests

# Transfer to Pi
scp target/application-0.0.1-SNAPSHOT.jar username@PI_IP:/home/username/beehive/backend/target/

# On Pi - restart application
sudo systemctl restart beehive-app.service
```

#### Update Frontend
```bash
# On Mac
cd frontend
vercel --prod
```

### Backup

#### Database Backup
```bash
# Create backup
docker exec dashboard_postgres pg_dump -U dashboard_user dashboard_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker exec -i dashboard_postgres psql -U dashboard_user dashboard_db < backup.sql
```

#### Application Backup
```bash
# Backup application files
tar -czf beehive_backup_$(date +%Y%m%d_%H%M%S).tar.gz /home/username/beehive/
```

---

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Cloudflare     │    │  Raspberry Pi   │
│   (Vercel)      │◄──►│   Tunnel         │◄──►│   Backend       │
│                 │    │                  │    │                 │
│ Next.js App     │    │ External Access  │    │ Spring Boot     │
│ React UI        │    │ HTTPS Tunnel     │    │ Java 17         │
│ Authentication  │    │ Load Balancing   │    │ PostgreSQL      │
└─────────────────┘    └──────────────────┘    │ Docker          │
                                               └─────────────────┘
```

## Security Considerations

- Use strong passwords for database
- Implement proper JWT token validation
- Configure CORS properly
- Use HTTPS for all external communication
- Regularly update system packages
- Monitor access logs

## Performance Tips

- Use connection pooling for database
- Implement caching where appropriate
- Monitor memory usage on Pi
- Use CDN for static assets
- Optimize database queries

---

**Congratulations! Your BeeHive dashboard is now fully deployed and accessible from anywhere! 🎉**

For support or questions, refer to the individual component documentation or create an issue in the project repository.