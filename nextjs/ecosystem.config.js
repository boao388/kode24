module.exports = {
    apps: [
        {
            // Development 환경
            name: 'kode24-dev',
            script: 'node_modules/.bin/next',
            args: 'dev --turbopack',
            cwd: '/root/app/kode24/nextjs',
            env: {
                NODE_ENV: 'development',
                PORT: 3000,
                JWT_SECRET: 'kode24-admin-secret-key-2024',
                DATABASE_URL: "postgresql://postgres.expqjhfhpltpkiwghxyi:kode24+=@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true",
                DIRECT_URL: "postgresql://postgres.expqjhfhpltpkiwghxyi:kode24+=@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres",
                NEXT_PUBLIC_SUPABASE_URL: 'https://expqjhfhpltpkiwghxyi.supabase.co',
                NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4cHFqaGZocGx0cGtpd2doeHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NjkyNzQsImV4cCI6MjA3MTE0NTI3NH0.Rn4JOUjX-7D8u_QyeDwNG1E_9dhEkNV42AMq9hDxp54',
                SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4cHFqaGZocGx0cGtpd2doeHlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU2OTI3NCwiZXhwIjoyMDcxMTQ1Mjc0fQ.WkVp0jhcrOh6SxDylpz9Vbouv5m52oaOyDKXZnida_0',
                NEXT_PUBLIC_BASE_URL: '',
                NAVER_VERIFICATION_ID: '9a45d6fd048dbd26a8d3f3feded9727878fc4ae0'
            },
            watch: false,
            autorestart: true,
            max_restarts: 10,
            min_uptime: '10s',
            exec_mode: 'fork',
            instances: 1,
            log_file: './logs/dev.log',
            error_file: './logs/dev-error.log',
            out_file: './logs/dev-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm Z',
            merge_logs: true,
        },
        {
            // Production 환경 
            name: 'kode24-prod',
            script: 'node_modules/.bin/next',
            args: 'start',
            cwd: '/root/app/kode24/nextjs',
            env: {
                NODE_ENV: 'production',
                PORT: 3001,
                JWT_SECRET: 'kode24-admin-secret-key-2024',
                DATABASE_URL: "postgresql://postgres.expqjhfhpltpkiwghxyi:kode24+=@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true",
                DIRECT_URL: "postgresql://postgres.expqjhfhpltpkiwghxyi:kode24+=@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres",
                NEXT_PUBLIC_SUPABASE_URL: 'https://expqjhfhpltpkiwghxyi.supabase.co',
                NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4cHFqaGZocGx0cGtpd2doeHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NjkyNzQsImV4cCI6MjA3MTE0NTI3NH0.Rn4JOUjX-7D8u_QyeDwNG1E_9dhEkNV42AMq9hDxp54',
                SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4cHFqaGZocGx0cGtpd2doeHlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU2OTI3NCwiZXhwIjoyMDcxMTQ1Mjc0fQ.WkVp0jhcrOh6SxDylpz9Vbouv5m52oaOyDKXZnida_0',
                NEXT_PUBLIC_BASE_URL: '',
                NAVER_VERIFICATION_ID: '9a45d6fd048dbd26a8d3f3feded9727878fc4ae0'
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 3001,
                JWT_SECRET: 'kode24-admin-secret-key-2024',
                DATABASE_URL: "postgresql://postgres.expqjhfhpltpkiwghxyi:kode24+=@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true",
                DIRECT_URL: "postgresql://postgres.expqjhfhpltpkiwghxyi:kode24+=@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres",
                NEXT_PUBLIC_SUPABASE_URL: 'https://expqjhfhpltpkiwghxyi.supabase.co',
                NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4cHFqaGZocGx0cGtpd2doeHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NjkyNzQsImV4cCI6MjA3MTE0NTI3NH0.Rn4JOUjX-7D8u_QyeDwNG1E_9dhEkNV42AMq9hDxp54',
                SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4cHFqaGZocGx0cGtpd2doeHlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU2OTI3NCwiZXhwIjoyMDcxMTQ1Mjc0fQ.WkVp0jhcrOh6SxDylpz9Vbouv5m52oaOyDKXZnida_0',
                NEXT_PUBLIC_BASE_URL: '',
                NAVER_VERIFICATION_ID: '9a45d6fd048dbd26a8d3f3feded9727878fc4ae0'

            },
            watch: false,
            autorestart: true,
            max_restarts: 5,
            min_uptime: '30s',
            exec_mode: 'cluster',
            instances: 1, // CPU 코어 수에 맞게 조정
            max_memory_restart: '1024M',
            log_file: './logs/prod.log',
            error_file: './logs/prod-error.log',
            out_file: './logs/prod-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm Z',
            merge_logs: true,
            kill_timeout: 5000,
            listen_timeout: 8000,
            shutdown_with_message: true,
        }
    ],

}
