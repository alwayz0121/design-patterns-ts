# GoF 디자인 패턴 23가지 — 쇼핑몰로 배우기

JavaScript로 개발을 배운 내가, **디자인 패턴을 제대로 이해하고 싶어서** AI와 함께 만든 학습 프로젝트입니다.

추상적인 패턴 개념 대신, **실제 쇼핑몰 기능**을 예시로 삼아 "왜 이 패턴이 필요한가"를 체감할 수 있도록 구성했습니다.

---

## 프로젝트 소개

- 빌드 도구 없는 **순수 HTML / CSS / JavaScript** 구성
- 각 패턴마다 **BAD → GOOD 코드 비교** 제공
- TypeScript 문법으로 작성된 예시 코드 (브라우저에서 바로 확인 가능)
- 쇼핑몰 시나리오 기반으로 23가지 패턴 전부 다룸

---

## 실행 방법

별도 설치 없이 `index.html` 파일을 브라우저에서 바로 열면 됩니다.

```
design-patterns-ts/index.html  →  브라우저로 열기
```

---

## 페이지 구성

| 파일 | 내용 |
|---|---|
| `index.html` | 홈 — 학습 순서 안내 |
| `ts-concepts.html` | TypeScript 기초 개념 (interface, abstract, generic 등) |
| `patterns.html` | 패턴 탐색기 — 23가지 패턴 BAD/GOOD 코드 비교 |
| `playground.html` | 퀴즈 — 코드 시나리오를 보고 패턴 맞히기 |

---

## 다루는 패턴

### 생성 패턴 (Creational) — 쇼핑몰 뼈대 만들기
| 패턴 | 쇼핑몰 예시 |
|---|---|
| Singleton | 전체 앱에서 공유하는 ShopConfig |
| Builder | 메서드 체이닝으로 주문서 작성 |
| Factory Method | CJ / 롯데 배송사 선택 |
| Abstract Factory | PC / 모바일 UI 세트 일관되게 생성 |
| Prototype | 기본 상품 템플릿을 복제해 프리미엄 상품 생성 |

### 구조 패턴 (Structural) — 기능 연결하고 조합하기
| 패턴 | 쇼핑몰 예시 |
|---|---|
| Adapter | 외부 PG사(Toss) SDK를 내부 인터페이스에 맞게 연결 |
| Decorator | 상품에 선물포장 · 빠른배송 옵션 동적 추가 |
| Facade | 주문 한 번에 재고확인 → 쿠폰 → 결제 → 배송 → 알림 처리 |
| Proxy | 상품 정보 DB 조회 결과 캐싱 |
| Composite | 카테고리 트리 (의류 > 맨투맨 · 청바지) |
| Bridge | 상품카드 · 배너 컴포넌트를 PC / 모바일 렌더러와 분리 |
| Flyweight | 지도 위 상품 마커 — 카테고리 아이콘 이미지 공유 |

### 행위 패턴 (Behavioral) — 쇼핑몰에 생명 불어넣기
| 패턴 | 쇼핑몰 예시 |
|---|---|
| Observer | 재고 변경 시 장바구니 · 품절임박 알림 자동 발송 |
| Strategy | 결제 수단(카드 / 카카오페이 / 네이버페이) 런타임 교체 |
| Command | 장바구니 상품 추가 Undo |
| State | 주문 상태 머신 (결제대기 → 완료 → 배송중 → 배송완료) |
| Template Method | 일반 / 특급 주문 확인 이메일 생성 |
| Chain of Responsibility | 쿠폰 · 회원 · 세일 할인 체인 |
| Mediator | 검색창 키워드 변경 → 정렬 버튼 활성화 중재 |
| Memento | 장바구니 스냅샷 저장 및 복원 |
| Iterator | 상품 목록 커스텀 이터러블 (for...of / spread 지원) |
| Visitor | 실물 · 디지털 상품의 가격 계산 · 영수증 출력 분리 |
| Interpreter | 비율 할인 + 고정 금액 할인 규칙 조합 표현식 |

---

## 만든 이유

디자인 패턴을 처음 접하면 예시가 너무 추상적이라 "그래서 언제 쓰는 건데?"라는 의문이 남았습니다.

쇼핑몰이라는 친숙한 도메인에 패턴을 직접 적용해보니, 각 패턴이 어떤 문제를 해결하는지 훨씬 명확하게 와닿았습니다. 같은 고민을 하는 분들에게도 도움이 되길 바라는 마음으로 공개합니다.

---

## 기술 스택

- HTML / CSS / JavaScript (빌드 도구 없음)
- TypeScript 문법 예시 코드 (실행용 아닌 학습용)

---

> 이 프로젝트는 AI(Claude)의 도움을 받아 제작되었습니다.
