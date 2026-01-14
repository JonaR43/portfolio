#!/bin/bash
# Production database migration script
# Run from: portfolio/backend directory
#
# Usage: ./scripts/migrate-prod.sh
#
# Before running, set your production credentials:
#   export PROD_DB_PASSWORD="your-url-encoded-password"
#   export PROD_DB_HOST="aws-0-region.pooler.supabase.com"
#   export PROD_DB_USER="postgres.your-project-ref"

if [ -z "$PROD_DB_PASSWORD" ] || [ -z "$PROD_DB_HOST" ] || [ -z "$PROD_DB_USER" ]; then
  echo "❌ Error: Missing environment variables"
  echo ""
  echo "Please set the following before running:"
  echo "  export PROD_DB_USER=\"postgres.your-project-ref\""
  echo "  export PROD_DB_PASSWORD=\"your-url-encoded-password\""
  echo "  export PROD_DB_HOST=\"aws-0-region.pooler.supabase.com\""
  echo ""
  echo "Note: URL-encode special characters in password (e.g., ! = %21, @ = %40)"
  exit 1
fi

export DATABASE_URL="postgresql://${PROD_DB_USER}:${PROD_DB_PASSWORD}@${PROD_DB_HOST}:6543/postgres?pgbouncer=true"
export DIRECT_URL="postgresql://${PROD_DB_USER}:${PROD_DB_PASSWORD}@${PROD_DB_HOST}:5432/postgres"

echo "🚀 Running migrations on production database..."
echo "   Host: $PROD_DB_HOST"
echo ""

npx prisma migrate deploy

if [ "$1" == "--seed" ]; then
  echo ""
  echo "🌱 Seeding production database..."
  npx tsx prisma/seed.ts
fi

echo ""
echo "✅ Done!"
