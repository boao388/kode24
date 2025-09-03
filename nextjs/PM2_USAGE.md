# KODE24 Next.js PM2 운영 가이드

## 개요
KODE24 법률사무소 웹사이트를 PM2로 운영하기 위한 설정 및 사용법입니다.

## PM2 설치
```bash
# 전역 설치
npm install -g pm2

# 부팅 시 자동 시작 설정
pm2 startup
pm2 save
```

## 실행 명령어

### 개발 환경 (Development)
```bash
# 개발 서버 시작 (포트 3000, Turbopack 사용)
npm run pm2:dev

# 또는 직접 PM2 명령어
pm2 start ecosystem.config.js --only kode24-dev
```

### 프로덕션 환경 (Production)
```bash
# 프로덕션 빌드 후 서버 시작 (포트 3001, 클러스터 모드 2인스턴스)
npm run pm2:prod

# 또는 직접 PM2 명령어
npm run build
pm2 start ecosystem.config.js --only kode24-prod --env production
```

## 관리 명령어

### 상태 확인
```bash
# PM2 프로세스 상태 확인
npm run pm2:status
pm2 status

# 실시간 로그 확인
npm run pm2:logs
pm2 logs

# 실시간 모니터링
pm2 monit
```

### 프로세스 제어
```bash
# 모든 프로세스 중지
npm run pm2:stop
pm2 stop all

# 특정 앱만 중지
pm2 stop kode24-dev
pm2 stop kode24-prod

# 모든 프로세스 재시작
npm run pm2:restart
pm2 restart all

# 무중단 재배포 (클러스터 모드)
npm run pm2:reload
pm2 reload ecosystem.config.js

# 프로세스 완전 삭제
npm run pm2:delete
pm2 delete all
```

### 로그 관리
```bash
# 로그 확인
pm2 logs kode24-dev
pm2 logs kode24-prod

# 로그 파일 위치
./logs/dev.log          # 개발 환경 통합 로그
./logs/dev-error.log    # 개발 환경 에러 로그
./logs/dev-out.log      # 개발 환경 출력 로그
./logs/prod.log         # 프로덕션 통합 로그
./logs/prod-error.log   # 프로덕션 에러 로그
./logs/prod-out.log     # 프로덕션 출력 로그

# 로그 비우기
pm2 flush
```

## 환경 설정

### 개발 환경 (kode24-dev)
- **포트**: 3000
- **모드**: Fork (단일 인스턴스)
- **Turbopack**: 활성화 (빠른 개발)
- **자동 재시작**: 활성화
- **최대 재시작**: 10회

### 프로덕션 환경 (kode24-prod)
- **포트**: 3001
- **모드**: Cluster (2인스턴스)
- **메모리 제한**: 512MB
- **자동 재시작**: 활성화 (30초 최소 가동시간)
- **최대 재시작**: 5회
- **무중단 배포**: 지원

## 모니터링

### 실시간 모니터링
```bash
# PM2 모니터링 대시보드
pm2 monit

# 웹 모니터링 (PM2 Plus 연동 시)
pm2 link <secret_key> <public_key>
```

### 리소스 사용량 확인
```bash
# 메모리/CPU 사용량 확인
pm2 show kode24-prod

# 프로세스 상세 정보
pm2 describe kode24-prod
```

## 트러블슈팅

### 자주 발생하는 문제

#### 1. 포트 충돌
```bash
# 포트 사용 중인 프로세스 확인
lsof -i :3000
lsof -i :3001

# PM2로 관리되는 프로세스 정리
pm2 delete all
```

#### 2. 메모리 부족
```bash
# 메모리 사용량 확인
pm2 show kode24-prod

# 메모리 제한 조정 (ecosystem.config.js에서)
max_memory_restart: '1G'  // 512M → 1G로 변경
```

#### 3. 빌드 오류
```bash
# Next.js 빌드 캐시 정리
rm -rf .next
npm run build

# PM2 프로세스 재시작
pm2 restart kode24-prod
```

## 배포 워크플로우

### 로컬 개발
1. `npm run pm2:dev` - 개발 서버 시작
2. 코드 수정 및 테스트
3. `npm run pm2:stop` - 개발 서버 중지

### 프로덕션 배포
1. `git pull origin main` - 최신 코드 받기
2. `npm install` - 의존성 업데이트
3. `npm run build` - 프로덕션 빌드
4. `npm run pm2:reload` - 무중단 재배포

## 보안 고려사항

- 프로덕션 환경에서는 .env 파일에 민감한 정보 저장
- PM2 로그 파일 권한 설정: `chmod 640 logs/*.log`
- 정기적인 로그 로테이션 설정 권장

## 성능 최적화

- 클러스터 인스턴스 수는 서버 CPU 코어 수와 동일하게 설정 권장
- 메모리 사용량 모니터링 후 max_memory_restart 값 조정
- 로그 파일 크기가 커지면 logrotate 설정 고려
