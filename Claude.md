요청하신 내용을 바탕으로, **비개발자 사장님도 이해할 수 있는 비즈니스 로직**과 **개발자를 위한 기술 설계**를 통합한 기획서입니다. 이 내용을 복사하여 `.md` 파일로 저장하시면 됩니다.

---

# [기획서] 실물 자산(RWA) 기반 NFT 조각 투자 플랫폼

## 1. 비즈니스 개요 (Business Overview)

* **플랫폼 명칭:** (가칭) 조각(JOGAK) - 실물 자산 조각 투자 서비스
* **핵심 가치:** 고가의 실물 자산(포켓몬 카드, 유명 가수 굿즈 등)을 조각 단위로 나누어 소액으로도 소유하고 거래할 수 있는 환경 제공
* **타겟 고객:** 팬덤 마켓, 희귀 수집품 수집가, 소액 투자자

---

## 2. 수익 모델 (Revenue Model)

플랫폼의 지속 가능한 운영을 위해 단계별 수수료 체계를 구축합니다.

1. **구매 수수료 (Primary/Secondary Fee):** 사용자가 조각을 구매할 때 결제 금액의 **3.0%** 추가 징수 (명목: 서비스 이용료)
2. **판매 수수료 (Trading Fee):** 조각을 재판매하여 현금화할 때 판매 금액의 **2.0%** 차감 (명목: 시스템 유지비)
3. **셀러 등록 수수료 (Listing Fee):** 판매자가 상품을 최초 등록하고 조각을 발행할 때 자산 가치의 **5.0%** 징수 (명목: 실물 검수 및 감정비)
4. **가스비 차익:** 저렴한 메인넷(솔라나/Base) 사용 시 실제 가스비(약 10원)와 사용자 정산 수수료 사이의 차액 발생

---

## 3. 사용자 시나리오 (User Scenario)

### A. 판매자(Seller) 시나리오

1. **권한 획득:** 일반 유저가 본인 인증 후 '셀러'로 전환
2. **상품 등록:** 실물 자산 정보(사진, 감정서, 총 가치 등) 입력
3. **조각 설정:** 총 발행 조각 수(예: 1,000개) 및 조각당 단가 입력
4. **실물 입고:** 플랫폼 지정 창고로 실물 발송 및 검수 대기
5. **발행(Mint):** 검수 완료 후 플랫폼이 조각 NFT 발행 승인

### B. 투자자(Investor) 시나리오

1. **간편 가입:** 이메일/소셜 로그인 (계정 추상화 지갑 자동 생성)
2. **결제:** 신용카드/간편결제로 조각 구매 (코인 환전 과정 생략)
3. **소유:** 내 지갑에서 조각 NFT 확인 및 소유 증명
4. **수익:** 자산 가치 상승 시 조각을 재판매하거나 실물 매각 시 지분만큼 배당

---

## 4. 개발 설계 초안 (Technical Specification)

### A. 기술 스택

* **Frontend:** React (Web), React Native (Mobile) - TypeScript(TSX) 기반
* **Blockchain:** Base (이더리움 L2) 또는 Solana (고속/저비용)
* **Smart Contract:** ERC-1155 (다중 토큰 표준) - 조각 발행에 최적화
* **Wallet:** Privy 또는 Particle Network (AA 지갑)
* **Payment:** Portone 또는 Toss Payments (원화 결제 연동)

### B. 핵심 데이터 구조 (TypeScript)

```tsx
/**
 * 1. 자산(NFT) 정보 구조
 */
interface RWAAsset {
  id: string;
  title: string;           // 자산명 (예: 1세대 리자몽 카드)
  totalValue: number;      // 총 가치 (원화)
  fractionCount: number;   // 발행 조각 수
  unitPrice: number;       // 조각당 가격 (totalValue / fractionCount)
  status: 'PENDING' | 'ACTIVE' | 'SOLD'; // 검수중, 거래중, 매각됨
}

/**
 * 2. 수수료 계산 로직
 */
const calculateFee = (price: number) => {
  const BUY_FEE_RATE = 0.03; // 3%
  const fee = price * BUY_FEE_RATE;
  return {
    itemPrice: price,
    serviceFee: fee,
    totalPayment: price + fee
  };
};

/**
 * 3. 스마트 컨트랙트 호출 (가스비 대납 포함)
 */
async function purchaseFraction(assetId: string, quantity: number) {
  // Paymaster를 통한 가스리스 거래 실행
  const tx = await smartWallet.sendTransaction({
    to: CONTRACT_ADDRESS,
    data: contract.interface.encodeFunctionData("buy", [assetId, quantity]),
    paymaster: PAYMASTER_ADDRESS // 플랫폼이 가스비 지불
  });
  return tx;
}

```

---

## 5. 단계별 구축 로드맵 (Roadmap)

1. **1단계 (MVP):** 셀러의 실물 등록 및 관리자 승인 시스템 구축
2. **2단계 (Wallet):** 소셜 로그인 기반의 자동 지갑 생성 연동
3. **3단계 (Payment):** 원화 결제 시 자동으로 코인 스왑 및 NFT 전송 기능 구현
4. **4단계 (Market):** 사용자 간 조각을 사고팔 수 있는 2차 마켓플레이스 오픈

---

## 6. 기대 효과 및 리스크 관리

* **기대 효과:** 고가 자산의 유동화, 팬덤 기반의 신규 시장 창출, 낮은 진입 장벽으로 인한 대중화
* **리스크 관리:** * **법률:** 토큰 증권(STO) 가이드라인 준수 및 법률 검토 (증권성 여부)
* **신뢰:** 실물 자산의 안전한 보관(금고) 및 정기적인 실사 공개
* **기술:** 스마트 컨트랙트 보안 감사(Audit) 진행



---

이 기획서는 4년 전의 실패 요인이었던 **사용성(UX)**과 **비용(Gas Fee)** 문제를 기술적으로 완전히 해결하고, **플랫폼 수수료 수익**을 명확히 하는 데 초점을 맞추었습니다. 추가로 궁금하신 부분이나 수정이 필요한 영역이 있으면 말씀해 주세요.