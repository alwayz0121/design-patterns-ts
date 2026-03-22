// 패턴별 게임 조합식 + "이럴 때 써요" + 코드 설명 데이터
const PATTERN_EXTRAS = {
  singleton: {
    trigger: '🚨 같은 설정 객체(Config, Logger)를 여러 곳에서 new로 만들고 있다면?',
    before_note: '🔴 new를 두 번 하면 → 서로 다른 객체가 만들어집니다. 한쪽에서 값을 바꿔도 다른 쪽에는 반영이 안 돼요!',
    after_note: '🟢 private 생성자로 외부 new를 막고, static getInstance()로만 접근. 항상 같은 인스턴스를 반환합니다.',
    recipe: { parts: ['🐣 일반 클래스', '🔒 private 생성자', '📦 static 인스턴스'], result: '🏰 싱글톤', resultDesc: '전역에서 딱 하나만 존재!' },
    webExample: {
      scenario: '헤더의 장바구니 아이콘 숫자와 상세 페이지의 "담기" 버튼이 같은 상태를 봐야 해요. 각자 new CartStore()를 하면 서로 다른 장바구니가 되어버려요!',
      code: `// 어느 컴포넌트에서든 같은 장바구니 인스턴스를 공유
const cart1 = CartStore.getInstance()  // 헤더 컴포넌트에서
const cart2 = CartStore.getInstance()  // 상품 상세 페이지에서

cart1.addItem({ id: 'shoes-001', name: '운동화', price: 89000 })
console.log(cart2.totalCount) // ✅ 1 — 같은 인스턴스이므로 반영됨`
    }
  },
  builder: {
    trigger: '🚨 생성자 파라미터가 4개 이상이고, 어떤 것이 뭔지 헷갈린다면?',
    before_note: '🔴 생성자에 파라미터가 8개 → 순서를 외워야 하고, undefined를 채워야 하는 자리가 생깁니다. 가독성이 최악!',
    after_note: '🟢 메서드 체이닝으로 필요한 것만 골라 설정. .to().from().subject() — 코드만 봐도 무슨 뜻인지 알 수 있어요.',
    recipe: { parts: ['📦 복잡한 객체', '🔧 단계별 메서드', '⛓️ 메서드 체이닝'], result: '🏗️ 빌더', resultDesc: '레고처럼 조립해서 생성!' },
    webExample: {
      scenario: '상품 검색 필터가 카테고리, 가격 범위, 브랜드, 정렬 방식, 페이지 번호 등 옵션이 너무 많아요. 조건마다 URL 쿼리를 손으로 조립하면 실수가 나요.',
      code: `// 필터 조건을 선택적으로 골라 조립 — 체이닝으로 가독성 UP
const query = new ProductQueryBuilder()
  .category('shoes')
  .priceRange(10000, 100000)
  .brand('Nike')
  .sortBy('popularity')
  .page(2)
  .build()
// → /api/products?category=shoes&minPrice=10000&maxPrice=100000&brand=Nike&sort=popularity&page=2`
    }
  },
  'factory-method': {
    trigger: '🚨 결제 수단·알림 채널별로 if/else가 점점 길어지고 있다면?',
    before_note: '🔴 새 결제 수단이 생길 때마다 이 함수를 직접 수정해야 합니다. 수정할수록 버그 위험이 커져요.',
    after_note: '🟢 새 결제 수단 = 새 클래스만 추가. 기존 코드는 전혀 건드리지 않아도 됩니다! (OCP 원칙)',
    recipe: { parts: ['🏭 생성 인터페이스', '👶 서브클래스들', '🔄 OCP 원칙'], result: '🏭 팩토리', resultDesc: '코드 변경 없이 새 타입 추가!' },
    webExample: {
      scenario: '주문 완료 후 "이메일", "카카오톡", "앱 푸시" 세 가지 알림 채널 중 어떤 것을 써야 할지 설정에 따라 달라져요. if/else로 분기하다 보면 코드가 너무 복잡해져요.',
      code: `// 알림 채널별 팩토리 — 새 채널 추가 시 기존 코드 수정 0줄
class EmailNotificationFactory extends NotificationFactory {
  createNotifier() { return new EmailNotifier() }
}
class KakaoNotificationFactory extends NotificationFactory {
  createNotifier() { return new KakaoNotifier() }
}

// 설정 한 줄만 바꾸면 전체 알림이 카카오로 전환!
const factory = new KakaoNotificationFactory()
factory.notify(order, '주문이 완료되었습니다 🎉')`
    }
  },
  'abstract-factory': {
    trigger: '🚨 다크 모드/라이트 모드처럼 서로 어울려야 하는 객체 세트를 만들 때?',
    before_note: '🔴 테마를 바꿀 때 여러 곳에 흩어진 if/else를 모두 찾아 수정해야 합니다. 하나만 빠뜨려도 디자인이 어색해져요.',
    after_note: '🟢 테마 팩토리 하나를 교체하면 버튼, 입력창, 모달이 모두 한 번에 바뀝니다. 항상 어울리는 세트!',
    recipe: { parts: ['🎨 테마 패밀리', '🏭 팩토리 인터페이스', '🔗 연관 객체들'], result: '🎭 추상 팩토리', resultDesc: '항상 어울리는 세트로 생성!' },
    webExample: {
      scenario: '쇼핑몰에 다크/라이트 테마 전환 기능이 있어요. 테마가 바뀌면 상품 카드, 버튼, 네비게이션 바가 모두 함께 바뀌어야 해요. 하나라도 빠뜨리면 디자인이 어색해져요.',
      code: `// 테마 팩토리 하나를 교체하면 전체 UI가 한 번에 교체됨
class DarkThemeFactory implements UIFactory {
  createProductCard() { return new DarkProductCard() }
  createButton()      { return new DarkButton() }
  createNavBar()      { return new DarkNavBar() }
}

// 다크 → 라이트 전환: 이 한 줄만 바꾸면 됨
const ui = new ShopUI(isDark ? new DarkThemeFactory() : new LightThemeFactory())
ui.renderAll() // 카드·버튼·네비 모두 같은 테마로!`
    }
  },
  prototype: {
    trigger: '🚨 비슷한 객체를 많이 만들어야 하는데, 처음부터 만들기 비용이 크다면?',
    before_note: '🔴 비슷한 객체를 생성자에 일일이 값을 채워 만듭니다. 속성이 늘어날수록 복사 코드가 길어지고, 실수가 생겨요.',
    after_note: '🟢 clone()으로 원본을 복사한 뒤 다른 부분만 수정. 기존 객체 구조를 그대로 활용합니다.',
    recipe: { parts: ['🥚 원본 객체', '📋 clone() 메서드', '✂️ 필요한 부분만 수정'], result: '🐑 프로토타입', resultDesc: '복사 → 수정! 처음부터 재생성 없음.' },
    webExample: {
      scenario: '"나이키 에어맥스 블랙 260" 상품을 "화이트 265" 변형으로 만들어야 해요. 브랜드, 설명, 배송 정책은 전부 같고 색상·사이즈만 달라요.',
      code: `const baseProduct = new Product({ brand: 'Nike', name: '에어맥스 90', description: '클래식 러닝화...', shippingPolicy: '무료배송' })

const white265 = baseProduct.clone()
white265.color = 'white'; white265.size = 265

const black260 = baseProduct.clone()
black260.color = 'black'; black260.size = 260
// 공통 속성은 복사, 다른 부분만 덮어씌움!`
    }
  },
  adapter: {
    trigger: '🚨 외부 라이브러리를 쓰고 싶은데 인터페이스가 달라서 바로 못 쓴다면?',
    before_note: '🔴 우리 코드는 log(msg)를 기대하는데 외부 라이브러리는 writeLog("INFO", msg)를 씁니다. 그냥 가져다 쓸 수가 없어요.',
    after_note: '🟢 LoggerAdapter 클래스가 중간에서 log() → writeLog()로 변환. 외부 라이브러리도, 우리 코드도 변경 없이 연결!',
    recipe: { parts: ['🔌 기존 클래스', '🔄 어댑터 래퍼', '🎯 원하는 인터페이스'], result: '🔌 어댑터', resultDesc: '코드 수정 없이 연결!' },
    webExample: {
      scenario: '토스페이먼츠 SDK는 pay(amount, orderId)를 쓰는데, 우리 내부 결제 인터페이스는 processPayment({ amount, order }) 형태예요. SDK를 그대로 쓸 수가 없어요.',
      code: `// 어댑터가 토스 SDK를 우리 인터페이스로 변환
class TossPaymentAdapter implements PaymentGateway {
  constructor(private toss: TossPaymentsSDK) {}
  processPayment({ amount, order }: PaymentRequest) {
    return this.toss.pay(amount, order.id) // SDK가 원하는 형태로 변환
  }
}
const gateway: PaymentGateway = new TossPaymentAdapter(new TossPaymentsSDK())
gateway.processPayment({ amount: 89000, order }) // 우리 방식 그대로!`
    }
  },
  decorator: {
    trigger: '🚨 기능 조합마다 새 클래스를 만들고 있어서 클래스가 폭발적으로 늘어난다면?',
    before_note: '🔴 아메리카노+우유, 아메리카노+설탕, 아메리카노+우유+설탕 … 조합마다 클래스가 하나씩 생깁니다.',
    after_note: '🟢 데코레이터를 마트료시카 인형처럼 감쌉니다. 클래스 추가 없이 new MilkDecorator(new SugarDecorator(...))로 자유롭게 조합!',
    recipe: { parts: ['☕ 기본 객체', '🎀 포장지 클래스', '🔁 중첩 가능'], result: '🎂 데코레이터', resultDesc: '러시아 인형처럼 기능을 겹겹이!' },
    webExample: {
      scenario: '상품 API 호출할 때 어디선 로딩 스피너가 필요하고, 어디선 에러 토스트도 필요하고, 어디선 캐싱도 필요해요. 이 조합이 페이지마다 달라요.',
      code: `let api: ProductAPI = new BaseProductAPI()
api = new LoadingSpinnerDecorator(api)   // 로딩 표시 추가
api = new ErrorToastDecorator(api)       // 에러 토스트 추가
api = new CachingDecorator(api)          // 캐싱 추가

// 호출부는 동일! 기능만 겹겹이 쌓인다
await api.getProducts()  // 캐싱 → 에러처리 → 로딩 → 실제 요청`
    }
  },
  facade: {
    trigger: '🚨 사용자가 내부 시스템을 너무 많이 알아야 사용할 수 있다면?',
    before_note: '🔴 영화 한 편 보려고 TV·스피커·플레이어·조명을 모두 직접 제어해야 합니다. 순서를 틀리면 안 돼요.',
    after_note: '🟢 HomeTheaterFacade.watchMovie()만 부르면 끝! 내부 복잡성은 퍼사드 안에 완전히 숨겨집니다.',
    recipe: { parts: ['🏢 복잡한 서브시스템들', '🚪 단순한 창구 클래스', '🙈 내부 숨김'], result: '🏪 퍼사드', resultDesc: '창구 하나로 모든 걸 해결!' },
    webExample: {
      scenario: '"주문하기" 버튼을 누르면 재고 확인 → 결제 처리 → 포인트 적립 → 알림 발송이 순서대로 일어나야 해요. 이 복잡한 로직을 버튼 클릭 핸들러에 전부 쓸 수는 없잖아요.',
      code: `// 버튼 클릭 핸들러 — 퍼사드 하나만 알면 됨
const order = new OrderFacade()
await order.placeOrder(cart, userInfo)
// 내부에서: 재고확인 → PG결제 → 포인트적립 → 이메일발송 자동 처리`
    }
  },
  proxy: {
    trigger: '🚨 같은 데이터를 매번 DB에서 불러와서 느리다면? 또는 접근 권한을 제어하고 싶다면?',
    before_note: '🔴 동일한 userId로 getUser()를 100번 부르면 DB를 100번 조회합니다. 엄청난 낭비예요.',
    after_note: '🟢 CachedUserService가 첫 조회 결과를 Map에 저장. 두 번째부터는 DB 조회 없이 캐시에서 즉시 반환!',
    recipe: { parts: ['🤵 대리인 객체', '💾 캐싱/접근 제어', '🎭 같은 인터페이스'], result: '🛡️ 프록시', resultDesc: '실제 객체 앞에서 비서 역할!' },
    webExample: {
      scenario: '상품 목록에 이미지가 수십 장 있어요. 페이지 로드 시 전부 다운받으면 너무 느려요. 스크롤해서 보이는 시점에만 로딩하고 싶어요.',
      code: `class LazyImageProxy implements ImageLoader {
  private loaded = false
  constructor(private src: string, private el: HTMLImageElement) {}
  load() {
    if (!this.loaded) {
      this.el.src = this.src  // 실제 이미지 로딩
      this.loaded = true
    }
  }
}
// IntersectionObserver + Proxy → 뷰포트 진입 시에만 load() 호출`
    }
  },
  composite: {
    trigger: '🚨 파일/폴더처럼 단일 항목과 그룹을 같은 방식으로 다루고 싶다면?',
    before_note: '🔴 instanceof로 파일인지 폴더인지 매번 확인해야 합니다. 새 타입이 생기면 이 체크가 또 늘어나요.',
    after_note: '🟢 File도 Folder도 FileSystemItem 인터페이스로 동일하게 처리. getSize(), print() 한 번의 호출로 트리 전체가 순회됩니다.',
    recipe: { parts: ['📄 단일 객체 (잎)', '📁 복합 객체 (가지)', '🌳 트리 구조'], result: '🌲 컴포지트', resultDesc: '파일이든 폴더든 동일하게 처리!' },
    webExample: {
      scenario: '쇼핑몰 카테고리가 "패션 > 신발 > 운동화" 처럼 트리 구조예요. 개별 상품과 카테고리 그룹을 같은 방식으로 메뉴에 렌더링하고 싶어요.',
      code: `const fashion = new CategoryGroup('패션')
const shoes = new CategoryGroup('신발')
shoes.add(new CategoryItem('운동화', '/sneakers'))
shoes.add(new CategoryItem('구두', '/dress-shoes'))
fashion.add(shoes)
fashion.add(new CategoryItem('티셔츠', '/tshirts'))

fashion.render() // 재귀적으로 전체 트리 렌더링!`
    }
  },
  bridge: {
    trigger: '🚨 "기능 × 구현" 조합 때문에 클래스 수가 기하급수적으로 늘어난다면?',
    before_note: '🔴 원 2개 × 렌더러 2개 = 4개 클래스. 원이나 렌더러가 하나씩 추가될 때마다 클래스가 배가 됩니다.',
    after_note: '🟢 Shape는 Renderer를 주입받아 사용. 원 종류 + 렌더러 종류 = 총 클래스 수. 기하급수 → 선형!',
    recipe: { parts: ['🎨 추상화 (앞면)', '⚙️ 구현 (뒷면)', '🌉 분리된 계층'], result: '🌉 브릿지', resultDesc: '추상화와 구현을 분리해 독립 확장!' },
    webExample: {
      scenario: '상품 목록을 "그리드 레이아웃"과 "리스트 레이아웃" 두 가지로 보여줄 수 있어요. 그리고 렌더러도 PC 웹과 모바일이 달라요. 3×2=6개 클래스를 만드는 건 너무 비효율적이에요.',
      code: `// 레이아웃 2개 × 렌더러 2개 → 클래스 4개가 아닌 2+2개!
const gridMobile   = new GridLayout(new MobileRenderer())
const gridPC       = new GridLayout(new PCRenderer())
const listMobile   = new ListLayout(new MobileRenderer())

gridPC.render(products) // PC 그리드 레이아웃으로 렌더링`
    }
  },
  flyweight: {
    trigger: '🚨 비슷한 객체가 수천~수백만 개 만들어져서 메모리가 부족하다면?',
    before_note: '🔴 100만 개 나무마다 수 MB짜리 텍스처를 각자 저장합니다. 메모리가 순식간에 가득 차요.',
    after_note: '🟢 동일한 텍스처는 하나의 TreeType 인스턴스로 공유. 위치(x, y)만 분리해 저장. 메모리 수백 배 절약!',
    recipe: { parts: ['🔷 공유할 공통 데이터', '📍 고유 데이터(위치 등)', '🏭 플라이웨이트 팩토리'], result: '🪁 플라이웨이트', resultDesc: '공통 부분을 공유해 메모리 절약!' },
    webExample: {
      scenario: '상품 카드가 수백 개 렌더링돼요. 각 카드마다 hover 스타일, 폰트, 그림자 설정을 따로 객체로 만들면 메모리가 폭발해요.',
      code: `// 카드 스타일은 공유, 상품 데이터(id, title, price)만 각자 보유
const cardStyle = CardStyleFactory.getStyle('default') // 한 번만 생성, 공유!

products.forEach(product => {
  new ProductCard(product.id, product.title, product.price, cardStyle).render()
  // cardStyle 인스턴스는 모든 카드가 공유 → 메모리 대폭 절약
})`
    }
  },
  observer: {
    trigger: '🚨 상태가 바뀔 때마다 여러 곳에 직접 update()를 호출하고 있다면?',
    before_note: '🔴 setPrice() 안에서 chart, notification, log를 직접 호출. 새 구독자가 생기면 이 함수를 또 수정해야 해요.',
    after_note: '🟢 subscribe()로 구독자를 등록하면 끝. 이벤트 발생 시 notify()가 자동으로 모든 구독자에게 알립니다. 구독자 코드는 건드리지 않아도 돼요!',
    recipe: { parts: ['📢 발행자 (Subject)', '👂 구독자들 (Observer)', '🔔 자동 알림'], result: '📡 옵저버', resultDesc: '유튜브 구독처럼 자동 알림!' },
    webExample: {
      scenario: '품절 상품에 "재입고 알림 받기" 버튼이 있어요. 재고가 들어오면 알림 신청한 고객 모두에게 이메일·앱 푸시를 동시에 보내야 해요.',
      code: `const stock = new StockNotifier('나이키 에어맥스')

// 고객들이 알림 구독
stock.subscribe(new EmailNotifier('alice@email.com'))
stock.subscribe(new AppPushNotifier('user-token-789'))

// 재고 입고 → 구독자 전원에게 자동 알림!
stock.restock(50)  // "재입고 알림" 이메일 + 앱 푸시 동시 발송`
    }
  },
  strategy: {
    trigger: '🚨 결제 방법·정렬 방식·압축 알고리즘 등 if/else로 분기가 계속 추가된다면?',
    before_note: '🔴 결제 수단이 하나 추가될 때마다 checkout 함수 파일을 직접 열어서 else if 블록을 또 추가해야 합니다.',
    after_note: '🟢 새 결제 수단 = 새 클래스만 추가. setStrategy()로 교체. checkout() 코드는 한 줄도 바꾸지 않아도 됩니다!',
    recipe: { parts: ['🎮 전략 인터페이스', '🃏 교체 가능한 전략들', '🔄 런타임 교체'], result: '♟️ 전략', resultDesc: '알고리즘을 런타임에 갈아끼워!' },
    webExample: {
      scenario: '상품 목록 정렬 드롭다운에 "최신순", "낮은 가격순", "높은 가격순", "인기순"이 있어요. 선택 때마다 정렬 방식이 바뀌어야 하는데 if/else로 하면 코드가 너무 길어져요.',
      code: `const productList = new ProductList(products)

// 드롭다운 선택에 따라 전략만 교체
productList.setSort(new PriceAscStrategy())   // 낮은 가격순
productList.render()

productList.setSort(new PopularityStrategy())  // 인기순으로 전환
productList.render()  // render() 코드는 한 줄도 안 바뀜!`
    }
  },
  command: {
    trigger: '🚨 실행 취소(Undo) 기능이나 작업 큐(Queue)가 필요하다면?',
    before_note: '🔴 텍스트 편집 동작이 함수 호출로 바로 실행되어 버립니다. 무엇을 했는지 기록이 없으니 Undo가 불가능해요.',
    after_note: '🟢 동작을 Command 객체로 만들어 history에 쌓습니다. undoLast()는 스택에서 꺼내 undo()만 부르면 끝!',
    recipe: { parts: ['📦 요청을 객체화', '✅ execute()', '↩️ undo()'], result: '🎮 커맨드', resultDesc: '요청 = 객체! Undo도 쉽게!' },
    webExample: {
      scenario: '장바구니에 상품을 담으면 "취소" 버튼으로 되돌릴 수 있어야 해요. 또 "좋아요" 버튼도 실수로 누르면 취소가 가능해야 해요.',
      code: `const cart = new ShoppingCart()

cart.execute(new AddItemCommand(cart, { id: 'shoes-001', name: '운동화', price: 89000 }))
cart.execute(new AddItemCommand(cart, { id: 'bag-002',   name: '가방',   price: 45000 }))
console.log(cart.items.length) // 2

cart.undo() // 가방 담기 취소!
console.log(cart.items.length) // 1`
    }
  },
  state: {
    trigger: '🚨 하나의 객체가 상태별로 다르게 동작하고, 상태 체크 if/else가 복잡해진다면?',
    before_note: '🔴 상태가 "결제대기 → 결제완료 → 배송중 → ..." 처럼 늘어날수록 if/else 블록이 기하급수적으로 복잡해집니다.',
    after_note: '🟢 각 상태가 자신의 동작을 직접 처리. 상태 전환은 setState()로 위임. if문이 전혀 없어도 상태마다 다르게 동작!',
    recipe: { parts: ['🔴 상태1 객체', '🟢 상태2 객체', '🔄 상태 전환'], result: '🚦 상태', resultDesc: '상태 = 객체! 조건문 없이 동작 변경!' },
    webExample: {
      scenario: '주문 상태가 "결제대기 → 결제완료 → 배송준비 → 배송중 → 배송완료"로 바뀌어요. 각 상태마다 가능한 액션이 다르고 (배송중엔 취소 불가 등), if/else로 관리하면 버그가 생겨요.',
      code: `const order = new Order()
order.getStatus() // "결제대기"
order.next()      // → "결제완료" (취소 버튼 노출)
order.next()      // → "배송중" (취소 버튼 자동 숨김)
order.cancel()    // ❌ 배송중엔 취소 불가 — 상태 객체가 자동으로 막음`
    }
  },
  'template-method': {
    trigger: '🚨 여러 클래스가 순서는 똑같고 세부 구현만 다를 때, 코드가 중복된다면?',
    before_note: '🔴 CSVParser와 JSONParser의 데이터 읽기·집계 코드가 완전히 똑같습니다. 기능이 바뀔 때마다 두 파일을 모두 수정해야 해요.',
    after_note: '🟢 부모 클래스에서 parse() → parseData() → aggregate() 순서를 고정. 자식은 parseData()만 구현. 공통 로직은 딱 한 곳에!',
    recipe: { parts: ['📋 템플릿 메서드 (순서 고정)', '✏️ abstract 단계들', '👶 서브클래스 구현'], result: '📒 템플릿 메서드', resultDesc: '레시피는 고정, 재료만 바꿔!' },
    webExample: {
      scenario: '회원 결제와 비회원 결제는 "장바구니 확인 → 주소 입력 → 결제 → 완료" 순서는 같지만, 주소 입력 단계에서 회원은 저장된 주소를 불러오고 비회원은 직접 입력해요.',
      code: `abstract class CheckoutFlow {
  process() {
    this.validateCart()    // 1. 공통: 장바구니 확인
    this.getAddress()      // 2. 다름: 회원/비회원 구분
    this.processPayment()  // 3. 공통: 결제
    this.sendConfirmation()// 4. 공통: 완료 이메일
  }
  protected abstract getAddress(): void
}
class MemberCheckout extends CheckoutFlow {
  protected getAddress() { /* 저장된 주소 불러오기 */ }
}`
    }
  },
  'chain-of-resp': {
    trigger: '🚨 요청 처리 로직이 중첩된 if로 연결되거나, 처리자를 동적으로 바꾸고 싶다면?',
    before_note: '🔴 레벨별 처리가 하나의 함수에 모두 들어있습니다. 새 레벨 추가 시 이 함수를 수정해야 하고, 순서를 바꾸기도 어려워요.',
    after_note: '🟢 각 핸들러가 자신이 처리할 수 없으면 super.handle()로 다음 핸들러에 넘깁니다. 체인 순서·구성을 런타임에 자유롭게 변경 가능!',
    recipe: { parts: ['🔗 핸들러 체인', '❓ 내가 처리? 다음으로?', '➡️ 동적 연결'], result: '⛓️ 책임 연쇄', resultDesc: '컨베이어 벨트처럼 다음 핸들러로!' },
    webExample: {
      scenario: 'API 요청이 들어올 때마다 "JWT 인증 → 요청 로깅 → 캐시 확인 → 실제 처리" 순서로 통과해야 해요. Express 미들웨어가 바로 이 패턴이에요.',
      code: `// 미들웨어 체인 — 각 핸들러가 next()로 다음에 넘김
const pipeline = new AuthMiddleware()
pipeline
  .setNext(new LoggingMiddleware())
  .setNext(new CacheMiddleware())
  .setNext(new ApiHandler())

pipeline.handle(request) // 인증 → 로깅 → 캐시 → 처리 순으로 통과`
    }
  },
  mediator: {
    trigger: '🚨 컴포넌트들이 서로를 직접 참조해서 의존성이 거미줄처럼 엉켜있다면?',
    before_note: '🔴 FormInput이 SubmitButton을 직접 참조하고, SubmitButton이 Tooltip을 직접 참조합니다. 컴포넌트가 늘어날수록 의존성이 폭발!',
    after_note: '🟢 컴포넌트는 중재자에게만 이벤트를 보냅니다. 누가 어떻게 반응하는지는 중재자가 결정. 컴포넌트끼리 서로 몰라도 돼요!',
    recipe: { parts: ['🧩 컴포넌트들', '🗺️ 중재자 (Hub)', '↔️ 간접 통신'], result: '🎙️ 미디에이터', resultDesc: '관제탑을 통해 모든 통신!' },
    webExample: {
      scenario: '검색 페이지에 검색창, 카테고리 필터, 가격 슬라이더, 결과 목록이 있어요. 검색창이 바뀌면 필터도 리셋되고, 필터가 바뀌면 결과가 갱신돼요. 이 상호작용을 직접 연결하면 거미줄이 돼요.',
      code: `// 모든 컴포넌트는 중재자에게만 이벤트를 보냄
const mediator = new SearchPageMediator(searchBox, filterPanel, resultList)

// 검색창이 바뀌면 중재자가 알아서 필터 리셋 + 결과 갱신
searchBox.onChange('운동화')  // 중재자가 전체 조율`
    }
  },
  memento: {
    trigger: '🚨 객체의 이전 상태로 되돌리는 기능(Undo/세이브)이 필요하다면?',
    before_note: '🔴 히스토리를 위해 객체 내부에 string[] 배열을 직접 노출합니다. 내부 구조가 외부에 다 드러나 있어요.',
    after_note: '🟢 Memento가 상태를 캡슐화해 저장. Caretaker는 메멘토를 관리하지만 내용은 모릅니다. 내부 구현이 완전히 숨겨져요!',
    recipe: { parts: ['📸 상태 스냅샷 (Memento)', '🏛️ 원본 객체', '🗃️ 히스토리 관리자'], result: '⏪ 메멘토', resultDesc: '게임 세이브/로드처럼!' },
    webExample: {
      scenario: '상품 리뷰 작성 중에 실수로 탭을 바꿨다가 다시 돌아왔을 때 작성 내용이 날아가면 너무 속상하죠. 임시 저장 기능이 필요해요.',
      code: `const review = new ReviewEditor()
review.type('이 운동화 정말 편해요!')
review.addPhoto('photo1.jpg')

// 자동 임시 저장 (30초마다 스냅샷)
const draft = review.save()  // Memento 생성
sessionStorage.setItem('draft', JSON.stringify(draft))

// 탭 복귀 후 복원
review.restore(draft)  // 작성 내용 그대로!`
    }
  },
  iterator: {
    trigger: '🚨 커스텀 자료구조를 for...of 나 spread로 순회하고 싶다면?',
    before_note: '🔴 getData()로 내부 배열을 직접 꺼내서 순회합니다. 나중에 자료구조가 Set이나 Map으로 바뀌면 이 코드도 다 바꿔야 해요.',
    after_note: '🟢 Symbol.iterator를 구현하면 for...of, ...(spread), Array.from() 모두 자동으로 동작. 내부가 배열이든 Set이든 상관없어요!',
    recipe: { parts: ['📚 커스텀 컬렉션', '🔄 Symbol.iterator', '🚶 next() 메서드'], result: '🔁 이터레이터', resultDesc: 'for...of, spread 모두 지원!' },
    webExample: {
      scenario: '상품 목록을 페이지 단위로 API에서 가져오는데, 사용자 입장에선 스크롤만 내리면 자연스럽게 다음 상품이 나와야 해요. (무한 스크롤)',
      code: `class InfiniteProductFeed {
  private page = 0
  [Symbol.asyncIterator]() {
    return {
      next: async () => {
        const items = await api.getProducts({ page: this.page++ })
        return items.length ? { value: items, done: false } : { value: [], done: true }
      }
    }
  }
}
// for await로 페이지마다 자동으로 다음 배치 로드!
for await (const batch of new InfiniteProductFeed()) { render(batch) }`
    }
  },
  visitor: {
    trigger: '🚨 기존 클래스 구조는 그대로 둔 채, 새로운 연산을 계속 추가해야 한다면?',
    before_note: '🔴 "직렬화" 기능을 추가하려면 Circle, Rectangle 등 모든 클래스를 수정해야 합니다. 클래스가 많을수록 작업이 폭발적으로 늘어요.',
    after_note: '🟢 새 연산 = 새 Visitor 클래스 하나만 추가. Circle, Rectangle은 수정 없이 그대로! (OCP를 구조 패턴에서 실현)',
    recipe: { parts: ['🏛️ 기존 구조 (변경 없음)', '🚶 방문자(Visitor) 객체', '🎯 새 연산 추가'], result: '🔍 비지터', resultDesc: '구조 건드리지 말고 기능만 추가!' },
    webExample: {
      scenario: '장바구니에 일반 상품, 묶음 상품, 디지털 상품이 담겨 있어요. 총액 계산, VIP 할인 적용, 쿠폰 할인 등 연산이 계속 추가되는데 상품 클래스를 매번 수정하기 싫어요.',
      code: `// 새 연산 = Visitor 클래스 하나만 추가 (상품 클래스 수정 없음!)
class TotalPriceVisitor implements CartItemVisitor {
  visitProduct(item: Product)     { return item.price * item.qty }
  visitBundle(item: BundleItem)   { return item.totalPrice * 0.9 } // 묶음 10% 할인
  visitDigital(item: DigitalItem) { return item.price }            // 배송비 없음
}

cart.items.forEach(item => item.accept(new TotalPriceVisitor()))`
    }
  },
  interpreter: {
    trigger: '🚨 작은 "언어"나 규칙 셋을 파싱하고 실행해야 한다면?',
    before_note: '🔴 수식 파서가 하드코딩 되어 있어서 새 연산자(-, *)가 추가되면 이 함수를 전체적으로 수정해야 합니다.',
    after_note: '🟢 각 연산자가 클래스 하나. 새 연산자 추가 = 새 클래스만 추가. 기존 코드 수정 없이 언어를 확장할 수 있어요!',
    recipe: { parts: ['📖 문법 규칙', '🔢 터미널 표현식', '🔀 복합 표현식'], result: '🗣️ 인터프리터', resultDesc: '문법을 클래스로! 확장 자유!' },
    webExample: {
      scenario: '검색창에 "price>50000 AND category=sneakers AND brand=Nike" 같은 고급 필터 쿼리를 입력할 수 있게 하고 싶어요. 이걸 파싱해서 실제 필터로 적용해야 해요.',
      code: `// 각 조건이 하나의 Expression 클래스
const filter = new AndExpression(
  new GreaterThanExpr('price', 50000),
  new AndExpression(
    new EqualsExpr('category', 'sneakers'),
    new EqualsExpr('brand', 'Nike')
  )
)
const filtered = products.filter(p => filter.evaluate(p))
// 새 연산자 추가 = 새 클래스만!`
    }
  }
}
