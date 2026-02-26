# PieceMarket RWA - 개발 가이드

> Claude가 이 파일을 읽으면 컨텍스트 파악 완료. 파일 탐색 없이 바로 코딩 시작 가능.

---

## 1. 프로젝트 개요

실물 자산(포켓몬 카드, K-Pop 굿즈, 명품 등)을 ERC-1155 조각 NFT로 분할하여 USDC로 거래하는 플랫폼.

- **이름:** PieceMarket (조각)
- **상태:** 데모 MVP 완성 (mock 데이터 기반, 블록체인 미연동)
- **체인:** Base (Ethereum L2) — 가스비 ~$0.01
- **결제 흐름:** 신용카드 → KRW→USDC 자동 스왑 → USDC로 조각 구매
- **통화 단위:** 모든 금액은 USDC (USD 아님)

---

## 2. 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| Framework | React Native CLI (Bare) | 0.76.9 |
| Language | TypeScript | 5.0.4 |
| Web | react-native-web + webpack 5 | 0.21.2 |
| Navigation | React Navigation v7 | bottom-tabs + native-stack |
| State | Zustand | 5.x |
| i18n | i18next + react-i18next | EN/KO/ID |
| Blockchain | viem | 2.46 (Base chain) |
| Node | v20.18.0 | |

---

## 3. 실행 명령어

```bash
npm run web          # 웹 개발서버 (localhost:3000)
npm run android      # 안드로이드
npm run ios          # iOS
npm run web:build    # 웹 프로덕션 빌드
```

---

## 4. 디렉토리 구조 (67개 소스 파일)

```
src/
├── assets/images/         # 로컬 PNG 7장 + index.ts (ES import)
├── components/
│   ├── asset/             # AssetCard, ProgressBar, CategoryChip
│   ├── common/            # Button, Modal, AssetImage, QuantitySelector, SearchBar, SectionHeader, EmptyState
│   ├── demo/              # UserSwitcher (데모 계정 전환)
│   └── purchase/          # PurchaseConfirmModal, PurchaseSuccessModal
├── config/                # env.ts / env.web.ts
├── constants/             # theme.ts, fees.ts, chains.ts, contracts.ts
├── data/                  # mockAssets.ts, mockUsers.ts, mockTransactions.ts
├── hooks/                 # useLanguage.ts
├── i18n/                  # index.ts + locales/(en|ko|id).json
├── navigation/            # RootNavigator, MainTabNavigator, 5 Stacks, types.ts, linking.ts
├── screens/
│   ├── admin/             # AdminDashboardScreen, RevenueWithdrawalScreen
│   ├── asset-detail/      # AssetDetailScreen, AssetCertificateScreen
│   ├── auth/              # LoginScreen, OnboardingScreen
│   ├── home/              # HomeScreen
│   ├── market/            # MarketScreen
│   ├── portfolio/         # PortfolioScreen, TransactionHistoryScreen
│   ├── profile/           # ProfileScreen, LanguageSettingsScreen
│   ├── seller/            # SellerRegistrationScreen
│   └── wallet/            # WalletDetailScreen
├── services/
│   ├── blockchain/        # client.ts, contracts.ts, actions.ts (placeholder)
│   └── wallet/            # privyConfig.ts, walletService.ts (placeholder)
├── store/                 # useAuthStore, useAssetStore, useWalletStore, useDemoStore, useSettingsStore
├── types/                 # asset.ts, transaction.ts, user.ts, images.d.ts
└── utils/                 # format.ts, fee.ts, polyfills.ts
```

---

## 5. 핵심 타입 (수정 시 반드시 참조)

```typescript
// src/types/asset.ts
interface RWAAsset {
  id, tokenId, title, description, imageUrl: string|number,
  category: AssetCategory, totalValue, fractionCount, unitPrice, soldFractions,
  status: AssetStatus, seller: {id, name, verified},
  createdAt, metadata: {appraisalCertUrl?, condition?, storageLocation?},
  custody?: CustodyInfo,       // 제3자 수탁 정보
  onChainProof?: OnChainProof, // 블록체인 증명
  legalRights?: LegalRights,   // 법적 권리
}

// src/types/transaction.ts
type TransactionType = 'BUY' | 'SELL' | 'LISTING' | 'WITHDRAWAL';

// src/types/user.ts
type UserRole = 'INVESTOR' | 'SELLER' | 'ADMIN';
```

---

## 6. 수수료 구조 (`src/constants/fees.ts`)

| 유형 | 비율 | 설명 |
|------|------|------|
| 구매 (BUY) | 3% | 서비스 이용료 |
| 판매 (SELL) | 2% | 시스템 유지비 |
| 등록 (LISTING) | 5% | 검수 및 감정비 |
| 교환 (SWAP) | 1.5% (양쪽) | 직접 교환 수수료 (sell+buy 5% 대비 40% 절약) |
| 가스비 | ~0.01 USDC | Base L2 (실제: 0.001 USDC, 차익 발생) |

---

## 7. 상태 관리 (Zustand stores)

| Store | 핵심 기능 |
|-------|-----------|
| `useAuthStore` | 로그인 상태, User 객체, `loginAsDemoUser()` |
| `useAssetStore` | 자산 목록, 포트폴리오, `purchaseFractions()`, `addAsset()`, `swapFractions()`, `seedDemoPortfolio()` |
| `useWalletStore` | USDC 잔액(기본 5000), `deductBalance()`, `addBalance()`, 거래 기록 |
| `useDemoStore` | 플랫폼 수익 추적, `recordTransaction()`, `getTotalRevenue()` |
| `useSwapStore` | 교환 오퍼 관리, `createOffer()`, `acceptOffer()`, `getMatchingOffers()` |
| `useSettingsStore` | 언어 설정 |

---

## 8. 네비게이션 구조

```
RootNavigator
├── Auth (LoginScreen — 데모 계정 3개 선택)
├── Onboarding
└── MainTabs
    ├── HomeTab    → Home, AssetDetail, AssetCertificate
    ├── MarketTab  → Market, AssetDetail, AssetCertificate
    ├── SwapTab    → SwapMarket, SwapDetail, CreateSwap
    ├── PortfolioTab → Portfolio, AssetDetail, AssetCertificate, TransactionHistory
    ├── AdminTab (ADMIN only) → AdminDashboard, RevenueWithdrawal
    └── ProfileTab → Profile, LanguageSettings, WalletDetail, SellerRegistration
```

---

## 9. 이미지 처리 (중요!)

- **웹:** webpack 5 `asset` 모듈 → ES `import`로 PNG를 URL 문자열로 변환
- **모바일:** Metro bundler → `require()`로 숫자(asset ID) 반환
- **크로스플랫폼 컴포넌트:** `AssetImage.tsx` — 웹은 `<img>` 태그, 모바일은 RN `<Image>`
- `src/types/images.d.ts`: PNG 모듈 선언 필수
- **절대 react-native의 `<Image>`를 직접 쓰지 말 것** → `AssetImage` 사용

---

## 10. i18n 키 구조

```
common, tabs, home, market, portfolio, profile, asset, auth,
wallet, categories, purchase, seller, admin, demo, certificate, swap
```
- 새 키 추가 시 **반드시 3개 파일(en/ko/id)** 동시 수정
- `certificate.*` 키: 신뢰/검증/수탁/법적권리/온체인증명/AA지갑 관련

---

## 11. 주의사항 & 트러블슈팅

| 이슈 | 해결 |
|------|------|
| viem 빌드 에러 | metro.config.js: `unstable_enablePackageExports: false` |
| polyfills 순서 | index.js에서 `polyfills.ts`를 **가장 먼저** import |
| react-native-get-random-values | 1.9.0 고정 (2.0은 RN 0.81+ 필요) |
| 웹 이미지 깨짐 | `<Image>` 대신 `AssetImage` 컴포넌트 사용 (웹은 `<img>` 직접 렌더) |
| webpack 이미지 | `url-loader` 대신 webpack 5 내장 `type: 'asset'` 사용 |
| 포트 충돌 | `npx kill-port 3000` |

---

## 12. 현재 구현 완료 (데모 MVP)

- [x] 홈/마켓/포트폴리오/프로필 4탭 UI
- [x] 자산 상세 + 수량 선택 + 수수료 계산 + 구매 플로우
- [x] 구매 확인/성공 모달 (mock 블록체인 tx)
- [x] 포트폴리오 실시간 반영 + 거래 내역
- [x] 셀러 자산 등록 (4단계 폼)
- [x] 지갑 화면 (USDC 충전, 잔액, 거래 내역)
- [x] 어드민 대시보드 + 수익 송금
- [x] 다중 사용자 데모 (투자자/셀러/관리자)
- [x] 자산 인증서 (제3자 수탁, 법적 권리, 온체인 증명, AA 지갑)
- [x] 조각 교환 (컬렉션 시스템, 매칭 오퍼, 수수료 비교, 교환 생성/수락)
- [x] 3개국어 (EN/KO/ID)
- [x] 웹 + 모바일 크로스플랫폼

---

## 13. 향후 개발 로드맵 (프로덕션 전환)

### Phase A: 블록체인 연동 (실제 Base 메인넷)
- [ ] ERC-1155 스마트 컨트랙트 배포 (Hardhat/Foundry)
- [ ] Paymaster 연동 (가스비 대납 — Coinbase Paymaster 또는 Pimlico)
- [ ] viem 기반 실제 트랜잭션 실행 (`src/services/blockchain/` 연결)
- [ ] 컨트랙트 감사 (CertiK, Hacken 등)

### Phase B: 지갑 & 인증
- [ ] Privy SDK 또는 Particle Network (AA 지갑 — 소셜 로그인)
- [ ] 현재 Privy는 Expo 모듈 필요 → RN CLI 환경에서 Particle이 더 적합할 수 있음
- [ ] KYC 연동 (Sumsub, Persona 등)

### Phase C: 결제 연동
- [ ] Portone 또는 Toss Payments (원화 → USDC 스왑)
- [ ] Circle USDC on-ramp API 검토
- [ ] 출금 (USDC → KRW 역스왑) 프로세스

### Phase D: 백엔드 & DB
- [ ] Node.js/NestJS API 서버 (자산 CRUD, 사용자 관리, 거래 정산)
- [ ] PostgreSQL + Prisma ORM
- [ ] 실물 자산 입고/검수 워크플로우 (관리자 승인)
- [ ] 알림 시스템 (FCM/APNs)

### Phase E: 2차 마켓
- [ ] P2P 조각 거래 (오더북 또는 AMM)
- [ ] 시세 차트 (가격 히스토리)
- [ ] 판매 수수료 2% 정산 로직

### Phase F: 법률 & 규제
- [ ] STO(토큰증권) 가이드라인 검토
- [ ] 약관/개인정보처리방침 작성
- [ ] 금융위 신고 요건 확인 (한국)

---

## 14. 코딩 컨벤션

- 컴포넌트: `function` 선언 + named export (`export function MyComponent`)
- 스타일: `StyleSheet.create()` 파일 하단
- 상태: Zustand (`create` + selector 패턴)
- 포맷: 금액은 `formatUSDC()` (utils/format.ts), 절대 하드코딩 하지 않기
- 이미지: 반드시 `AssetImage` 컴포넌트 사용
- i18n: 하드코딩 문자열 금지, 반드시 `t()` 사용 + 3개 언어 동시 추가
- 네비게이션: 새 스크린 추가 시 → types.ts + Stack + linking.ts 동시 수정
