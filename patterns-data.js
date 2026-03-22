const PATTERNS = [
  // ─── 생성 패턴 ───
  {
    id: 'singleton', category: 'creational', name: 'Singleton (싱글톤)',
    summary: '클래스 인스턴스를 딱 하나만 만들고 전역에서 공유',
    usecases: ['앱 설정(Config)', 'DB 연결 풀', '로거(Logger)', '캐시'],
    concept: '앱 어디서나 같은 인스턴스를 써야 할 때 사용합니다. 두 개 이상 만들면 데이터가 불일치할 수 있는 상황에서 특히 유용합니다.',
    before: {
      label: '❌ 문제: 매번 new로 생성',
      code: `// 매번 새 인스턴스가 생겨 설정값이 제각각!
class ShopConfig {
  apiEndpoint: string = 'http://localhost:8080'
  currency: string = 'KRW'
}

const config1 = new ShopConfig()
const config2 = new ShopConfig()
config1.apiEndpoint = 'https://api.myshop.com'

console.log(config1.apiEndpoint) // "https://api.myshop.com"
console.log(config2.apiEndpoint) // "http://localhost:8080" ← 다름!`
    },
    after: {
      label: '✅ 싱글톤 패턴 적용',
      code: `class ShopConfig {
  private static instance: ShopConfig | null = null
  private constructor() {} // ← 외부에서 new 불가!

  static getInstance(): ShopConfig {
    if (!ShopConfig.instance) {
      ShopConfig.instance = new ShopConfig()
    }
    return ShopConfig.instance
  }

  apiEndpoint: string = 'http://localhost:8080'
  currency: string = 'KRW'
}

const config1 = ShopConfig.getInstance()
const config2 = ShopConfig.getInstance()
config1.apiEndpoint = 'https://api.myshop.com'

console.log(config2.apiEndpoint) // "https://api.myshop.com" ← 같음!
console.log(config1 === config2) // true (동일 인스턴스)`
    }
  },
  {
    id: 'builder', category: 'creational', name: 'Builder (빌더)',
    summary: '복잡한 객체를 단계별로 조립해서 생성',
    usecases: ['쿼리 빌더', '이메일 작성기', '복잡한 설정 객체', 'URL 빌더'],
    concept: '생성자(constructor)에 파라미터가 너무 많아질 때 사용합니다. 각 옵션을 메서드 체이닝으로 명확하게 설정할 수 있습니다.',
    before: {
      label: '❌ 문제: 파라미터가 너무 많은 생성자',
      code: `// 어떤 파라미터가 뭔지 알기 어렵다!
class Order {
  constructor(
    productId: string, quantity: number, shippingAddress: string,
    couponCode?: string, giftWrap?: boolean, paymentMethod?: string
  ) {}
}

// 호출할 때 뭐가 뭔지 모름 :(
const order = new Order(
  'PROD-001', 2, '서울시 강남구',
  undefined, true, 'card'
)`
    },
    after: {
      label: '✅ 빌더 패턴 적용',
      code: `class OrderBuilder {
  private config: Partial<OrderConfig> = {}

  product(id: string)      { this.config.productId = id; return this }
  quantity(n: number)      { this.config.quantity = n; return this }
  shipTo(address: string)  { this.config.shippingAddress = address; return this }
  useCoupon(code: string)  { this.config.couponCode = code; return this }
  giftWrap()               { this.config.giftWrap = true; return this }
  payWith(method: string)  { this.config.paymentMethod = method; return this }

  place(): void {
    console.log('주문 완료:', this.config)
  }
}

// 이제 읽기 쉽다! (메서드 체이닝)
new OrderBuilder()
  .product('PROD-001')
  .quantity(2)
  .shipTo('서울시 강남구 테헤란로 123')
  .useCoupon('SAVE10')
  .giftWrap()
  .payWith('card')
  .place()`
    }
  },
  {
    id: 'factory-method', category: 'creational', name: 'Factory Method (팩토리 메서드)',
    summary: '객체 생성을 서브클래스에 위임해 유연하게 확장',
    usecases: ['결제 수단 생성', 'UI 컴포넌트 팩토리', '알림 채널', 'DB 드라이버'],
    concept: '"어떤 클래스를 만들지"를 서브클래스가 결정합니다. 객체 생성 코드를 한 곳에 모아 OCP(개방-폐쇄 원칙)를 지킵니다.',
    before: {
      label: '❌ 문제: if/else로 타입 분기',
      code: `function createShipping(type: string) {
  if (type === 'cj') {
    // CJ대한통운 초기화 로직 ...
    return { ship: (addr: string) => console.log(\`CJ배송 → \${addr}\`) }
  } else if (type === 'lotte') {
    // 롯데택배 초기화 로직 ...
    return { ship: (addr: string) => console.log(\`롯데배송 → \${addr}\`) }
  }
  // 새 배송사 추가 → 이 함수를 직접 수정해야 함!
}`
    },
    after: {
      label: '✅ 팩토리 메서드 패턴 적용',
      code: `interface Shipping {
  ship(address: string): void
}

// 각 배송사 클래스
class CJShipping implements Shipping {
  ship(address: string) { console.log(\`CJ대한통운 배송 → \${address}\`) }
}
class LotteShipping implements Shipping {
  ship(address: string) { console.log(\`롯데택배 배송 → \${address}\`) }
}

// 팩토리 (새 배송사 추가 → 여기만 수정!)
abstract class ShippingFactory {
  abstract createShipping(): Shipping

  processShipping(address: string): void {
    const shipping = this.createShipping()
    shipping.ship(address)
  }
}

class CJShippingFactory extends ShippingFactory {
  createShipping() { return new CJShipping() }
}
class LotteShippingFactory extends ShippingFactory {
  createShipping() { return new LotteShipping() }
}

const factory = new CJShippingFactory()
factory.processShipping('서울시 마포구') // CJ대한통운 배송 → 서울시 마포구`
    }
  },
  {
    id: 'abstract-factory', category: 'creational', name: 'Abstract Factory (추상 팩토리)',
    summary: '관련 객체들의 제품군을 일관되게 생성하는 인터페이스',
    usecases: ['UI 테마 (다크/라이트)', '플랫폼별 UI (Windows/Mac)', 'DB 드라이버 세트'],
    concept: '연관된 여러 객체를 패밀리 단위로 생성합니다. "모바일이면 상품카드도 모바일, 네비게이션도 모바일"처럼 일관성이 필요할 때 사용합니다.',
    before: {
      label: '❌ 문제: 플랫폼마다 if/else 분산',
      code: `function render(platform: string) {
  if (platform === 'mobile') {
    renderMobileProductCard()
    renderMobileNavBar()
    renderMobileCartButton()
  } else {
    renderPCProductCard()
    renderPCNavBar()
    renderPCCartButton()
  }
  // 새 플랫폼 추가 → 코드 곳곳을 수정해야 함!
}`
    },
    after: {
      label: '✅ 추상 팩토리 패턴 적용',
      code: `interface ShopUIFactory {
  createProductCard(): ProductCard
  createNavBar(): NavBar
}

class MobileUIFactory implements ShopUIFactory {
  createProductCard() { return new MobileProductCard() }
  createNavBar()      { return new MobileNavBar() }
}
class PCUIFactory implements ShopUIFactory {
  createProductCard() { return new PCProductCard() }
  createNavBar()      { return new PCNavBar() }
}

// 앱은 팩토리만 알면 됨 - 어떤 플랫폼인지 몰라도 OK
class ShopApp {
  constructor(private factory: ShopUIFactory) {}
  render() {
    const card = this.factory.createProductCard() // 항상 어울리는 세트
    const nav  = this.factory.createNavBar()
    card.draw(); nav.draw()
  }
}

const mobileApp = new ShopApp(new MobileUIFactory())
mobileApp.render() // 모바일 상품카드 + 모바일 네비게이션`
    }
  },
  {
    id: 'prototype', category: 'creational', name: 'Prototype (프로토타입)',
    summary: '원본 객체를 복사(clone)해서 새 객체 생성',
    usecases: ['게임 캐릭터 복제', '복잡한 설정 객체 복사', '문서 템플릿', 'Undo 상태 저장'],
    concept: '복잡한 객체를 처음부터 만드는 비용이 클 때, 기존 객체를 복사해서 사용합니다. JS의 Object.assign이나 spread로도 구현할 수 있습니다.',
    before: {
      label: '❌ 문제: 수동으로 속성 복사',
      code: `class Product {
  name: string; price: number; category: string; tags: string[]
  constructor(n: string, price: number, cat: string, tags: string[]) {
    this.name = n; this.price = price; this.category = cat; this.tags = tags
  }
}

const template = new Product('기본 티셔츠', 29000, '의류', ['면', '기본'])

// 하나씩 수동으로 복사해야 함 - 속성이 늘어날수록 힘들다
const clone = new Product(template.name, template.price, template.category, [...template.tags])`
    },
    after: {
      label: '✅ 프로토타입 패턴 적용',
      code: `interface Cloneable<T> {
  clone(): T
}

class Product implements Cloneable<Product> {
  constructor(
    public name: string,
    public price: number,
    public category: string,
    public tags: string[]
  ) {}

  clone(): Product {
    return new Product(this.name, this.price, this.category, [...this.tags])
  }
}

const baseShirt = new Product('기본 티셔츠', 29000, '의류', ['면', '기본'])
const premiumShirt = baseShirt.clone()
premiumShirt.name = '프리미엄 티셔츠'
premiumShirt.price = 59000
premiumShirt.tags.push('프리미엄')

console.log(baseShirt.name)    // 기본 티셔츠 (원본 유지)
console.log(premiumShirt.name) // 프리미엄 티셔츠`
    }
  },

  // ─── 구조 패턴 ───
  {
    id: 'adapter', category: 'structural', name: 'Adapter (어댑터)',
    summary: '호환되지 않는 인터페이스를 연결해주는 중간 변환기',
    usecases: ['외부 라이브러리 래핑', '레거시 코드 재사용', 'API 응답 변환', '결제사 SDK 통합'],
    concept: '110V 플러그를 220V 콘센트에 꽂을 때 어댑터가 필요하듯, 기존 코드를 수정하지 않고 새 인터페이스에 맞게 연결합니다.',
    before: {
      label: '❌ 문제: 외부 PG사 SDK 인터페이스가 다름',
      code: `// 우리 앱이 기대하는 인터페이스
interface PaymentGateway {
  pay(amount: number): void
  refund(orderId: string): void
}

// 외부 PG사 SDK (수정 불가!)
class TossPaymentsSDK {
  requestPayment(price: number, currency: string) {
    console.log(\`[Toss] \${currency} \${price} 결제 요청\`)
  }
  cancelPayment(txId: string) {
    console.log(\`[Toss] 거래 \${txId} 취소\`)
  }
}

// 직접 사용하면 인터페이스가 안 맞음...
const sdk = new TossPaymentsSDK()
sdk.requestPayment(15000, 'KRW') // 우리 방식과 다름`
    },
    after: {
      label: '✅ 어댑터 패턴 적용',
      code: `interface PaymentGateway {
  pay(amount: number): void
  refund(orderId: string): void
}

class TossPaymentsSDK {
  requestPayment(price: number, currency: string) {
    console.log(\`[Toss] \${currency} \${price} 결제 요청\`)
  }
  cancelPayment(txId: string) {
    console.log(\`[Toss] 거래 \${txId} 취소\`)
  }
}

// 어댑터: TossPaymentsSDK를 PaymentGateway 인터페이스에 맞게 변환
class TossAdapter implements PaymentGateway {
  constructor(private toss: TossPaymentsSDK) {}

  pay(amount: number)     { this.toss.requestPayment(amount, 'KRW') }
  refund(orderId: string) { this.toss.cancelPayment(orderId) }
}

// 이제 우리 인터페이스로 사용 가능!
const pg: PaymentGateway = new TossAdapter(new TossPaymentsSDK())
pg.pay(15000)        // [Toss] KRW 15000 결제 요청
pg.refund('ORD-001') // [Toss] 거래 ORD-001 취소`
    }
  },
  {
    id: 'decorator', category: 'structural', name: 'Decorator (데코레이터)',
    summary: '기존 객체를 감싸서 기능을 동적으로 추가',
    usecases: ['압축+암호화 스트림', '로깅 미들웨어', '캐싱 래퍼', 'UI 스크롤/테두리 추가'],
    concept: '상속 없이 기능을 덧붙입니다. 러시아 마트료시카 인형처럼 Decorator가 Decorator를 감쌀 수 있어 조합이 자유롭습니다.',
    before: {
      label: '❌ 문제: 조합마다 새 클래스 폭발',
      code: `class BasicProduct { price() { return 29000 } }
class ProductWithGiftWrap { price() { return 31000 } }
class ProductWithFastShipping { price() { return 32000 } }
class ProductWithGiftWrapAndFastShipping { price() { return 34000 } }
// 옵션이 늘수록 클래스 수가 기하급수적으로 증가!`
    },
    after: {
      label: '✅ 데코레이터 패턴 적용',
      code: `interface Product {
  price(): number
  description(): string
}

class BasicProduct implements Product {
  price()       { return 29000 }
  description() { return '맨투맨 티셔츠' }
}

// 데코레이터 기반 클래스
abstract class ProductDecorator implements Product {
  constructor(protected product: Product) {}
  price()       { return this.product.price() }
  description() { return this.product.description() }
}

class GiftWrapDecorator extends ProductDecorator {
  price()       { return this.product.price() + 2000 }
  description() { return this.product.description() + ' + 선물포장' }
}
class FastShippingDecorator extends ProductDecorator {
  price()       { return this.product.price() + 3000 }
  description() { return this.product.description() + ' + 빠른배송' }
}

// 마치 옵션 추가하듯 자유롭게 조합!
let item: Product = new BasicProduct()
item = new GiftWrapDecorator(item)
item = new FastShippingDecorator(item)

console.log(item.description()) // 맨투맨 티셔츠 + 선물포장 + 빠른배송
console.log(item.price())       // 34000`
    }
  },
  {
    id: 'facade', category: 'structural', name: 'Facade (퍼사드)',
    summary: '복잡한 서브시스템을 단순한 창구 하나로 제공',
    usecases: ['홈씨어터 리모컨', '결제 처리 통합', 'API Gateway', '복잡한 라이브러리 래핑'],
    concept: '건물 정면(Facade)처럼 내부 복잡한 구조를 숨기고 단순한 인터페이스만 제공합니다. 사용자는 내부를 몰라도 됩니다.',
    before: {
      label: '❌ 문제: 사용자가 내부 시스템을 다 알아야 함',
      code: `// 상품 하나 주문하려고 이 모든 걸 직접 해야 한다고?
const inventory = new Inventory(); inventory.check('PROD-001')
const coupon = new CouponService(); coupon.apply('SAVE10')
const payment = new Payment(); payment.charge('card', 29000)
const shipping = new Shipping(); shipping.schedule('서울시 강남구')
const notification = new Notification(); notification.sendEmail('주문 완료!')`
    },
    after: {
      label: '✅ 퍼사드 패턴 적용',
      code: `class OrderFacade {
  private inventory    = new Inventory()
  private coupon       = new CouponService()
  private payment      = new Payment()
  private shipping     = new Shipping()
  private notification = new Notification()

  placeOrder(productId: string, couponCode: string, address: string): void {
    // 복잡한 내부 로직을 숨김
    this.inventory.check(productId)
    this.coupon.apply(couponCode)
    this.payment.charge('card', 29000)
    this.shipping.schedule(address)
    this.notification.sendEmail('주문 완료!')
    console.log(\`✅ 주문이 완료되었습니다!\`)
  }

  cancelOrder(orderId: string): void {
    this.shipping.cancel(orderId)
    this.payment.refund(orderId)
    this.notification.sendEmail('주문 취소 완료')
  }
}

// 사용자는 이것만!
const order = new OrderFacade()
order.placeOrder('PROD-001', 'SAVE10', '서울시 강남구') // 한 줄로 끝!`
    }
  },
  {
    id: 'proxy', category: 'structural', name: 'Proxy (프록시)',
    summary: '실제 객체 대신 대리인을 두어 접근 제어·캐싱·지연로딩',
    usecases: ['이미지 지연 로딩', 'API 캐싱', '접근 권한 제어', 'Logging Proxy'],
    concept: '비서(Proxy)가 사장(Real Subject) 앞에서 요청을 걸러내거나 캐싱합니다. 실제 객체와 같은 인터페이스를 구현해 교체가 투명합니다.',
    before: {
      label: '❌ 문제: 매번 DB를 직접 조회',
      code: `class ProductService {
  getProduct(id: string): Product {
    console.log(\`DB에서 조회: \${id}\`)
    return db.query(\`SELECT * FROM products WHERE id=\${id}\`)
    // 같은 id로 100번 호출하면 100번 DB 쿼리!
  }
}`
    },
    after: {
      label: '✅ 프록시(캐싱) 패턴 적용',
      code: `interface IProductService {
  getProduct(id: string): Product
}

class ProductService implements IProductService {
  getProduct(id: string): Product {
    console.log(\`DB에서 조회: \${id}\`)
    return { id, name: '맨투맨 티셔츠', price: 29000 } // DB 쿼리 시뮬레이션
  }
}

// 캐싱 프록시 — 같은 인터페이스 구현
class CachedProductService implements IProductService {
  private cache = new Map<string, Product>()
  constructor(private service: IProductService) {}

  getProduct(id: string): Product {
    if (this.cache.has(id)) {
      console.log(\`캐시 히트: \${id}\`)
      return this.cache.get(id)!
    }
    const product = this.service.getProduct(id) // 실제 조회
    this.cache.set(id, product)
    return product
  }
}

const service: IProductService = new CachedProductService(new ProductService())
service.getProduct('PROD-001') // DB에서 조회: PROD-001
service.getProduct('PROD-001') // 캐시 히트: PROD-001 (DB 조회 없음!)`
    }
  },
  {
    id: 'composite', category: 'structural', name: 'Composite (컴포지트)',
    summary: '단일 객체와 복합 객체를 동일하게 취급하는 트리 구조',
    usecases: ['파일/폴더 구조', '조직도', 'UI 컴포넌트 트리', 'DOM 구조'],
    concept: '상품과 카테고리를 같은 방식으로 다룹니다. 카테고리는 상품 또는 또 다른 카테고리를 포함하는 트리 구조입니다.',
    before: {
      label: '❌ 문제: 상품과 카테고리를 다르게 처리',
      code: `// 카테고리인지 상품인지 매번 instanceof로 확인해야 함
function getTotalPrice(item: any): number {
  if (item instanceof Product) {
    return item.price
  } else if (item instanceof Category) {
    return item.items.reduce((sum: number, i: any) => sum + getTotalPrice(i), 0)
  }
  return 0
}`
    },
    after: {
      label: '✅ 컴포지트 패턴 적용',
      code: `interface CatalogItem {
  getPrice(): number
  getName(): string
  print(indent?: string): void
}

class Product implements CatalogItem {
  constructor(private name: string, private price: number) {}
  getPrice() { return this.price }
  getName()  { return this.name }
  print(indent = '') { console.log(\`\${indent}🛍️ \${this.name} (\${this.price.toLocaleString()}원)\`) }
}

class Category implements CatalogItem {
  private children: CatalogItem[] = []
  constructor(private name: string) {}

  add(item: CatalogItem) { this.children.push(item) }
  getPrice() { return this.children.reduce((s, c) => s + c.getPrice(), 0) }
  getName()  { return this.name }
  print(indent = '') {
    console.log(\`\${indent}📂 \${this.name}/\`)
    this.children.forEach(c => c.print(indent + '  '))
  }
}

const root = new Category('전체 상품')
const clothing = new Category('의류')
clothing.add(new Product('맨투맨', 29000))
clothing.add(new Product('청바지', 59000))
root.add(clothing)
root.add(new Product('에어팟', 199000))
root.print()
console.log(\`전체 금액: \${root.getPrice().toLocaleString()}원\`) // 287,000원`
    }
  },
  {
    id: 'bridge', category: 'structural', name: 'Bridge (브릿지)',
    summary: '추상화와 구현을 분리해 독립적으로 확장',
    usecases: ['플랫폼별 UI(Web/App)', '렌더러 교체', '드라이버 분리', 'DB + ORM 분리'],
    concept: '"컴포넌트"와 "플랫폼"처럼 2가지 차원의 변화를 독립적으로 확장하고 싶을 때 사용합니다.',
    before: {
      label: '❌ 문제: 조합마다 클래스 폭발',
      code: `// 컴포넌트 2개 × 플랫폼 2개 = 4개 클래스
class ProductCardPC { render() {} }
class ProductCardMobile { render() {} }
class BannerPC { render() {} }
class BannerMobile { render() {} }
// 컴포넌트나 플랫폼 추가 시 기하급수 증가!`
    },
    after: {
      label: '✅ 브릿지 패턴 적용',
      code: `interface Platform {
  render(component: string): void
}

class PCRenderer implements Platform {
  render(component: string) { console.log(\`[PC] <div class="\${component}"></div>\`) }
}
class MobileRenderer implements Platform {
  render(component: string) { console.log(\`[Mobile] <\${component} style="touch" />\`) }
}

abstract class ShopComponent {
  constructor(protected platform: Platform) {} // Bridge!
  abstract render(): void
}

class ProductCard extends ShopComponent {
  render() { this.platform.render('ProductCard') }
}
class Banner extends ShopComponent {
  render() { this.platform.render('Banner') }
}

// 조합 자유롭게! 클래스 수 = 컴포넌트 수 + 플랫폼 수
const pcCard = new ProductCard(new PCRenderer())
pcCard.render() // [PC] <div class="ProductCard"></div>

const mobileBanner = new Banner(new MobileRenderer())
mobileBanner.render() // [Mobile] <Banner style="touch" />`
    }
  },
  {
    id: 'flyweight', category: 'structural', name: 'Flyweight (플라이웨이트)',
    summary: '유사 객체의 공통 부분을 공유해 메모리 절약',
    usecases: ['게임 나무/적 오브젝트', '텍스트 에디터 문자', '지도 마커', '파티클 시스템'],
    concept: '지도에 100만 개의 상품 마커를 그릴 때 "카테고리 아이콘, 이미지" 데이터는 공유하고 "위치"만 따로 저장해 메모리를 대폭 줄입니다.',
    before: {
      label: '❌ 문제: 같은 데이터를 객체마다 중복 저장',
      code: `class ProductMarker {
  // 모든 마커가 동일한 이미지를 각자 저장!
  constructor(
    public x: number, public y: number,
    public image: string,   // 수 MB 크기 데이터
    public category: string
  ) {}
}

// 100만 개 마커 → image × 100만 = 메모리 초과!
const markers = Array.from({length: 1_000_000},
  (_, i) => new ProductMarker(i, i, '의류카테고리이미지대용량', 'clothing'))`
    },
    after: {
      label: '✅ 플라이웨이트 패턴 적용',
      code: `// 공유 데이터 (Flyweight)
class ProductIconType {
  constructor(
    public image: string,    // 공유!
    public category: string
  ) {}
  draw(x: number, y: number) {
    console.log(\`[\${x},\${y}] \${this.category} 아이콘 렌더링\`)
  }
}

// 팩토리: 같은 타입이면 같은 인스턴스 재사용
class ProductIconFactory {
  private static types = new Map<string, ProductIconType>()

  static getType(image: string, category: string): ProductIconType {
    const key = \`\${image}_\${category}\`
    if (!this.types.has(key)) {
      this.types.set(key, new ProductIconType(image, category))
      console.log('새 아이콘 타입 생성:', key)
    }
    return this.types.get(key)!
  }
}

// 위치만 달라지고 ProductIconType은 공유됨
const markers = [
  { x: 10, y: 20, type: ProductIconFactory.getType('clothes.png', '의류') },
  { x: 50, y: 80, type: ProductIconFactory.getType('clothes.png', '의류') }, // 재사용!
  { x: 30, y: 60, type: ProductIconFactory.getType('shoes.png', '신발') },
]
markers.forEach(m => m.type.draw(m.x, m.y))
console.log('아이콘 타입 인스턴스 수:', /* 3개 대신 */ '2개만!')`
    }
  },

  // ─── 행위 패턴 ───
  {
    id: 'observer', category: 'behavioral', name: 'Observer (옵저버)',
    summary: '상태 변경 시 구독자에게 자동으로 알림 전달',
    usecases: ['이벤트 리스너', '상태 관리(Redux)', '실시간 알림', 'DOM 이벤트'],
    concept: '유튜브 구독처럼, 채널(Subject)에 구독자(Observer)가 등록하면 새 이벤트 발생 시 자동으로 알림을 받습니다.',
    before: {
      label: '❌ 문제: 재고가 바뀔 때마다 직접 업데이트 호출',
      code: `class ProductStock {
  stock = 0

  setStock(n: number) {
    this.stock = n
    // 새 구독자가 생길 때마다 이 함수를 수정해야 함!
    cartComponent.update(n)
    wishlistService.notify(n)
    adminDashboard.refresh(n)
  }
}`
    },
    after: {
      label: '✅ 옵저버 패턴 적용',
      code: `interface Observer<T> {
  update(data: T): void
}

class EventEmitter<T> {
  private observers: Observer<T>[] = []

  subscribe(obs: Observer<T>)   { this.observers.push(obs) }
  unsubscribe(obs: Observer<T>) { this.observers = this.observers.filter(o => o !== obs) }
  notify(data: T)               { this.observers.forEach(o => o.update(data)) }
}

class ProductStock extends EventEmitter<number> {
  private _stock = 0
  set stock(n: number) { this._stock = n; this.notify(n) }
}

// 구독자 등록 → 재고가 바뀌면 자동 알림
const stock = new ProductStock()
stock.subscribe({ update: n => console.log(\`장바구니 뱃지 업데이트: 잔여 \${n}개\`) })
stock.subscribe({ update: n => n < 5 && console.log(\`⚠️ 품절 임박 알림! 잔여 \${n}개\`) })

stock.stock = 10
stock.stock = 3  // 품절 임박 알림도 동시에 발동!`
    }
  },
  {
    id: 'strategy', category: 'behavioral', name: 'Strategy (전략)',
    summary: '알고리즘을 캡슐화해 런타임에 교체 가능',
    usecases: ['정렬 알고리즘 선택', '결제 방법 선택', '압축 방식', '인증 전략'],
    concept: '"어떻게 할지(How)"를 교체 가능한 전략 객체로 분리합니다. if/else 없이 동작을 바꿀 수 있습니다.',
    before: {
      label: '❌ 문제: if/else로 전략 분기',
      code: `class ShoppingCart {
  checkout(paymentMethod: string, amount: number) {
    if (paymentMethod === 'card') {
      console.log(\`카드 결제: \${amount}원\`)
    } else if (paymentMethod === 'kakao') {
      console.log(\`카카오페이: \${amount}원\`)
    } else if (paymentMethod === 'naver') {
      console.log(\`네이버페이: \${amount}원\`)
    }
    // 결제 방법 추가 시 이 파일 수정 필요!
  }
}`
    },
    after: {
      label: '✅ 전략 패턴 적용',
      code: `interface PaymentStrategy {
  pay(amount: number): void
}

class CardStrategy implements PaymentStrategy {
  pay(amount: number) { console.log(\`💳 신용카드 결제: \${amount}원\`) }
}
class KakaoStrategy implements PaymentStrategy {
  pay(amount: number) { console.log(\`💛 카카오페이: \${amount}원\`) }
}
class NaverStrategy implements PaymentStrategy {
  pay(amount: number) { console.log(\`💚 네이버페이: \${amount}원\`) }
}

class ShoppingCart {
  private strategy: PaymentStrategy = new CardStrategy()

  setStrategy(strategy: PaymentStrategy) { this.strategy = strategy }

  checkout(amount: number) {
    this.strategy.pay(amount) // 전략에 위임!
  }
}

const cart = new ShoppingCart()
cart.checkout(59000)                     // 💳 신용카드 결제: 59000원

cart.setStrategy(new KakaoStrategy())
cart.checkout(59000)                     // 💛 카카오페이: 59000원`
    }
  },
  {
    id: 'command', category: 'behavioral', name: 'Command (커맨드)',
    summary: '요청을 객체로 캡슐화해 Undo/Redo, 큐잉 가능',
    usecases: ['텍스트 에디터 Undo', '매크로 녹화', '작업 큐', 'GUI 버튼 이벤트'],
    concept: '"무엇을 할지"를 객체로 만듭니다. execute()와 undo()를 함께 저장하면 실행 취소 기능을 쉽게 구현할 수 있습니다.',
    before: {
      label: '❌ 문제: Undo 기능이 없는 직접 실행',
      code: `class ShoppingCart {
  private items: string[] = []

  addItem(product: string)    { this.items.push(product) }
  removeItem(product: string) { this.items = this.items.filter(i => i !== product) }
  // Undo 구현하려면? 상태를 매번 저장해야 해서 복잡해짐
}`
    },
    after: {
      label: '✅ 커맨드 패턴 적용 (Undo 지원)',
      code: `interface Command {
  execute(): void
  undo(): void
}

class ShoppingCart {
  items: string[] = []
  private history: Command[] = []

  executeCommand(cmd: Command) {
    cmd.execute()
    this.history.push(cmd)
  }
  undoLast() {
    this.history.pop()?.undo()
  }
}

class AddItemCommand implements Command {
  constructor(private cart: ShoppingCart, private product: string) {}
  execute() { this.cart.items.push(this.product) }
  undo()    { this.cart.items = this.cart.items.filter(i => i !== this.product) }
}

const cart = new ShoppingCart()
cart.executeCommand(new AddItemCommand(cart, '맨투맨 티셔츠'))
cart.executeCommand(new AddItemCommand(cart, '청바지'))
console.log(cart.items) // ['맨투맨 티셔츠', '청바지']

cart.undoLast()
console.log(cart.items) // ['맨투맨 티셔츠'] ← Undo 작동!`
    }
  },
  {
    id: 'state', category: 'behavioral', name: 'State (상태)',
    summary: '객체 상태에 따라 동작이 달라지는 패턴',
    usecases: ['신호등 상태', '주문 상태 머신', '게임 캐릭터 모드', '자판기'],
    concept: '조건문 대신 각 상태를 객체로 만듭니다. 상태가 바뀌면 다른 로직이 자동으로 실행됩니다.',
    before: {
      label: '❌ 문제: 상태마다 if/else 중첩',
      code: `class Order {
  state = 'pending'
  next() {
    if (this.state === 'pending')     { this.state = 'paid' }
    else if (this.state === 'paid')   { this.state = 'shipping' }
    else if (this.state === 'shipping') { this.state = 'delivered' }
    // 상태 추가 시 여러 곳을 수정해야 함
  }
}`
    },
    after: {
      label: '✅ 상태 패턴 적용',
      code: `interface OrderState {
  next(order: Order): void
  display(): string
}

class PendingState implements OrderState {
  next(order: Order) { order.setState(new PaidState()) }
  display() { return '🕐 결제 대기' }
}
class PaidState implements OrderState {
  next(order: Order) { order.setState(new ShippingState()) }
  display() { return '✅ 결제 완료' }
}
class ShippingState implements OrderState {
  next(order: Order) { order.setState(new DeliveredState()) }
  display() { return '🚚 배송 중' }
}
class DeliveredState implements OrderState {
  next(_order: Order) { console.log('이미 배송 완료 상태입니다.') }
  display() { return '📦 배송 완료' }
}

class Order {
  private state: OrderState = new PendingState()
  setState(s: OrderState) { this.state = s }
  next()    { this.state.next(this) }
  display() { console.log(this.state.display()) }
}

const order = new Order()
order.display() // 🕐 결제 대기
order.next(); order.display() // ✅ 결제 완료
order.next(); order.display() // 🚚 배송 중`
    }
  },
  {
    id: 'template-method', category: 'behavioral', name: 'Template Method (템플릿 메서드)',
    summary: '알고리즘 뼈대를 정의하고 세부 구현은 서브클래스에 위임',
    usecases: ['데이터 파싱 파이프라인', '리포트 생성', '테스트 프레임워크', '게임 턴 처리'],
    concept: '요리 레시피처럼 순서(틀)는 고정하고, 각 단계의 구체적인 방법은 서브클래스가 결정합니다.',
    before: {
      label: '❌ 문제: 코드 중복 — 순서는 같은데 단계마다 복사',
      code: `class NormalOrderEmail {
  send(orderId: string) {
    const header = \`<h1>주문 확인</h1>\`                    // 헤더 (동일)
    const body   = \`<p>일반 배송 예정일: 3~5일</p>\`         // 본문 (다름)
    return header + body + \`<footer>감사합니다</footer>\`   // 푸터 (동일)
  }
}
class ExpressOrderEmail {
  send(orderId: string) {
    const header = \`<h1>주문 확인</h1>\`
    const body   = \`<p>당일 특급배송 예정 🚀</p>\`           // 본문만 다름
    return header + body + \`<footer>감사합니다</footer>\`
  }
}`
    },
    after: {
      label: '✅ 템플릿 메서드 패턴 적용',
      code: `abstract class OrderEmail {
  // 템플릿: 순서 고정!
  send(orderId: string): string {
    const header = this.buildHeader()         // 1. 헤더
    const body   = this.buildBody(orderId)    // 2. 본문 (서브클래스 구현)
    const footer = this.buildFooter()         // 3. 푸터
    return header + body + footer
  }

  protected buildHeader(): string { return '<h1>주문 확인</h1>' }
  protected buildFooter(): string { return '<footer>쇼핑해주셔서 감사합니다!</footer>' }
  // 서브클래스에서 반드시 구현
  protected abstract buildBody(orderId: string): string
}

class NormalOrderEmail extends OrderEmail {
  protected buildBody(orderId: string) {
    return \`<p>주문번호 \${orderId}: 일반 배송 (3~5일)</p>\`
  }
}
class ExpressOrderEmail extends OrderEmail {
  protected buildBody(orderId: string) {
    return \`<p>주문번호 \${orderId}: 당일 특급배송 🚀</p>\`
  }
}

const normal  = new NormalOrderEmail()
const express = new ExpressOrderEmail()
console.log(normal.send('ORD-001'))   // 일반 배송 이메일
console.log(express.send('ORD-002'))  // 특급배송 이메일`
    }
  },
  {
    id: 'chain-of-resp', category: 'behavioral', name: 'Chain of Responsibility (책임 연쇄)',
    summary: '요청을 처리할 수 있는 핸들러가 나타날 때까지 체인으로 전달',
    usecases: ['미들웨어 체인', '이벤트 버블링', '로그 레벨 처리', '권한 검사 체인'],
    concept: 'Express.js 미들웨어처럼, 요청이 핸들러를 차례로 통과하며 적합한 핸들러가 처리합니다.',
    before: {
      label: '❌ 문제: 중첩된 if로 처리',
      code: `function applyDiscount(type: string, amount: number): number {
  if (type === 'coupon') {
    console.log('쿠폰 적용')
    return amount * 0.9
  } else if (type === 'member') {
    console.log('회원 할인 적용')
    return amount * 0.95
  } else if (type === 'sale') {
    console.log('세일 적용')
    return amount * 0.8
  }
  return amount
}`
    },
    after: {
      label: '✅ 책임 연쇄 패턴 적용',
      code: `abstract class DiscountHandler {
  private next: DiscountHandler | null = null

  setNext(handler: DiscountHandler): DiscountHandler {
    this.next = handler
    return handler // 체이닝용
  }

  handle(type: string, amount: number): number {
    if (this.next) return this.next.handle(type, amount)
    return amount
  }
}

class CouponHandler extends DiscountHandler {
  handle(type: string, amount: number) {
    if (type === 'coupon') { console.log('[쿠폰] 10% 할인'); return amount * 0.9 }
    return super.handle(type, amount) // 다음 핸들러에 넘김
  }
}
class MemberHandler extends DiscountHandler {
  handle(type: string, amount: number) {
    if (type === 'member') { console.log('[회원] 5% 할인'); return amount * 0.95 }
    return super.handle(type, amount)
  }
}
class SaleHandler extends DiscountHandler {
  handle(type: string, amount: number) {
    if (type === 'sale') { console.log('[세일] 20% 할인 🎉'); return amount * 0.8 }
    return super.handle(type, amount)
  }
}

const chain = new CouponHandler()
chain.setNext(new MemberHandler()).setNext(new SaleHandler())

console.log(chain.handle('coupon', 50000)) // [쿠폰] 10% 할인 → 45000
console.log(chain.handle('sale',   50000)) // [세일] 20% 할인 → 40000`
    }
  },
  {
    id: 'mediator', category: 'behavioral', name: 'Mediator (중재자)',
    summary: '객체 간 직접 통신 대신 중재자를 통해 결합도 낮추기',
    usecases: ['채팅 서버', 'Air Traffic Control', '이벤트 버스', 'UI 폼 유효성 검사'],
    concept: '공항 관제탑처럼, 비행기들이 서로 직접 통신하지 않고 관제탑을 통해 통신합니다. 객체 수가 많을 때 의존성을 줄입니다.',
    before: {
      label: '❌ 문제: 컴포넌트가 서로 직접 참조',
      code: `class SearchInput {
  sortDropdown: SortDropdown // 직접 참조!
  onChange(keyword: string) {
    this.sortDropdown.enable(keyword.length > 0) // 강한 결합
  }
}
class SortDropdown {
  resultPanel: ResultPanel // 직접 참조!
  enable(v: boolean) {
    this.resultPanel.show(v ? '상품 목록' : '키워드를 입력해주세요')
  }
}`
    },
    after: {
      label: '✅ 중재자 패턴 적용',
      code: `interface Mediator {
  notify(sender: Component, event: string, data?: any): void
}

abstract class Component {
  constructor(protected mediator: Mediator) {}
}

class SearchInput extends Component {
  value = ''
  type(keyword: string) {
    this.value = keyword
    this.mediator.notify(this, 'keywordChanged', keyword)
  }
}
class SortDropdown extends Component {
  enabled = false
  setEnabled(v: boolean) { this.enabled = v; console.log(\`정렬 버튼 \${v?'활성':'비활성'}\`) }
}

// 중재자가 모든 상호작용 제어
class SearchMediator implements Mediator {
  constructor(
    private input: SearchInput,
    private sort: SortDropdown
  ) {}

  notify(_sender: Component, event: string, data: any) {
    if (event === 'keywordChanged') {
      this.sort.setEnabled(data.length > 0)
    }
  }
}

const input = new SearchInput(null!)
const sort  = new SortDropdown(null!)
const mediator = new SearchMediator(input, sort)
;(input as any).mediator = mediator

input.type('')       // 정렬 버튼 비활성
input.type('나이키')  // 정렬 버튼 활성`
    }
  },
  {
    id: 'memento', category: 'behavioral', name: 'Memento (메멘토)',
    summary: '객체 상태를 외부에 저장했다가 복원 (Undo/스냅샷)',
    usecases: ['텍스트 에디터 히스토리', '게임 세이브/로드', '설정 백업', '트랜잭션 롤백'],
    concept: '게임 세이브 파일처럼, 객체의 현재 상태를 스냅샷으로 저장합니다. Originator의 내부 구현을 노출하지 않습니다.',
    before: {
      label: '❌ 문제: 히스토리를 직접 관리',
      code: `class Cart {
  items: string[] = []
  history: string[][] = [] // 외부에 구현 노출

  save() { this.history.push([...this.items]) }
  undo() {
    if (this.history.length) {
      this.items = this.history.pop()!
    }
  }
}`
    },
    after: {
      label: '✅ 메멘토 패턴 적용',
      code: `// 메멘토: 상태의 스냅샷 (불변)
class CartMemento {
  constructor(private readonly items: string[]) {}
  getItems(): string[] { return [...this.items] }
}

// Originator: 상태를 가진 실제 객체
class Cart {
  private items: string[] = []

  addItem(product: string)  { this.items.push(product) }
  getItems()                { return [...this.items] }

  save(): CartMemento       { return new CartMemento(this.items) }
  restore(m: CartMemento)   { this.items = m.getItems() }
}

// Caretaker: 히스토리 관리만 담당
class CartHistory {
  private stack: CartMemento[] = []
  push(m: CartMemento) { this.stack.push(m) }
  pop(): CartMemento | undefined { return this.stack.pop() }
}

const cart = new Cart()
const history = new CartHistory()

cart.addItem('맨투맨 티셔츠')
history.push(cart.save())   // 스냅샷 저장

cart.addItem('청바지')
history.push(cart.save())

cart.addItem('에어팟')
console.log(cart.getItems()) // ['맨투맨 티셔츠', '청바지', '에어팟']

cart.restore(history.pop()!)
console.log(cart.getItems()) // ['맨투맨 티셔츠', '청바지']`
    }
  },
  {
    id: 'iterator', category: 'behavioral', name: 'Iterator (이터레이터)',
    summary: '컬렉션 내부 구조를 모르고도 순차적으로 순회',
    usecases: ['커스텀 자료구조 순회', '파일 목록 읽기', '무한 시퀀스', 'DB 커서'],
    concept: 'JS에서 for...of, spread가 동작하는 원리입니다. Symbol.iterator를 구현하면 어떤 객체든 이터러블로 만들 수 있습니다.',
    before: {
      label: '❌ 문제: 내부 구조에 의존한 순회',
      code: `class ProductList {
  private products: string[] = []
  add(product: string) { this.products.push(product) }
  getData() { return this.products } // 내부 배열 노출!
}

const list = new ProductList()
list.add('맨투맨'); list.add('청바지'); list.add('스니커즈')

// 내부 구조(배열)에 의존 - 자료구조가 바뀌면 이 코드도 바꿔야 함
list.getData().forEach(p => console.log(p))`
    },
    after: {
      label: '✅ 이터레이터 패턴 적용 (JS 표준)',
      code: `class ProductList implements Iterable<string> {
  private products: string[] = []
  add(product: string) { this.products.push(product) }

  // JS 표준 이터레이터 프로토콜 구현
  [Symbol.iterator](): Iterator<string> {
    let index = 0
    const products = this.products
    return {
      next(): IteratorResult<string> {
        return index < products.length
          ? { value: products[index++], done: false }
          : { value: undefined as any, done: true }
      }
    }
  }
}

const list = new ProductList()
list.add('맨투맨'); list.add('청바지'); list.add('스니커즈')

// 이제 for...of, spread 모두 사용 가능!
for (const p of list) { console.log(p) } // 맨투맨, 청바지, 스니커즈
const arr = [...list]
console.log(arr) // ['맨투맨', '청바지', '스니커즈']`
    }
  },
  {
    id: 'visitor', category: 'behavioral', name: 'Visitor (비지터)',
    summary: '객체 구조를 바꾸지 않고 새 동작을 추가',
    usecases: ['AST 처리', 'DOM 조작', '시리얼라이저', '코드 분석기'],
    concept: '세금 계산원(Visitor)이 집(Element)을 방문해 계산하는 것처럼, 새 연산을 추가할 때 기존 클래스를 수정하지 않습니다.',
    before: {
      label: '❌ 문제: 새 기능마다 모든 클래스를 수정',
      code: `class PhysicalProduct { getPrice() { return 29000 } }
class DigitalProduct  { getPrice() { return 9900 } }
// "배송비 계산" 기능 추가 → PhysicalProduct, DigitalProduct 모두 수정해야 함!`
    },
    after: {
      label: '✅ 비지터 패턴 적용',
      code: `interface Product {
  accept(visitor: ProductVisitor): void
}
interface ProductVisitor {
  visitPhysical(product: PhysicalProduct): void
  visitDigital(product: DigitalProduct): void
}

class PhysicalProduct implements Product {
  constructor(public name: string, public price: number, public weight: number) {}
  accept(v: ProductVisitor) { v.visitPhysical(this) }
}
class DigitalProduct implements Product {
  constructor(public name: string, public price: number) {}
  accept(v: ProductVisitor) { v.visitDigital(this) }
}

// 새 기능 = 새 Visitor 클래스 (기존 Product 클래스 수정 없음!)
class PriceCalculator implements ProductVisitor {
  visitPhysical(p: PhysicalProduct) { console.log(\`\${p.name}: \${p.price}원 (+ 배송비 3,000원)\`) }
  visitDigital(p: DigitalProduct)   { console.log(\`\${p.name}: \${p.price}원 (배송비 무료)\`) }
}
class ReceiptExporter implements ProductVisitor {
  visitPhysical(p: PhysicalProduct) { console.log(\`[영수증] 실물상품: \${p.name} \${p.weight}kg\`) }
  visitDigital(p: DigitalProduct)   { console.log(\`[영수증] 디지털상품: \${p.name}\`) }
}

const products: Product[] = [
  new PhysicalProduct('맨투맨', 29000, 0.5),
  new DigitalProduct('음악 앨범', 9900)
]
const calc = new PriceCalculator()
products.forEach(p => p.accept(calc)) // 가격 계산

const receipt = new ReceiptExporter()
products.forEach(p => p.accept(receipt)) // 영수증 출력`
    }
  },
  {
    id: 'interpreter', category: 'behavioral', name: 'Interpreter (인터프리터)',
    summary: '언어나 표현식의 문법을 정의하고 해석하는 패턴',
    usecases: ['수식 계산기', '쿼리 언어', '정규표현식', '설정 파일 파서'],
    concept: '문법 규칙을 클래스로 표현합니다. 재귀적인 언어 구조를 해석할 때 유용합니다.',
    before: {
      label: '❌ 문제: 하드코딩된 할인 규칙 처리',
      code: `// 할인 규칙이 바뀔 때마다 코드를 직접 수정!
function applyDiscount(code: string, amount: number): number {
  const parts = code.split('+')
  return parts.reduce((total, p) => {
    if (p.trim() === 'RATE10') return total * 0.9
    return total
  }, amount)
  // 새 할인 규칙 추가하려면? 이 함수를 크게 수정해야 함
}`
    },
    after: {
      label: '✅ 인터프리터 패턴 적용',
      code: `interface DiscountExpr {
  interpret(amount: number): number
}

class RateDiscount implements DiscountExpr {
  constructor(private rate: number) {} // 0.1 = 10% 할인
  interpret(amount: number) { return amount * (1 - this.rate) }
}
class FixedDiscount implements DiscountExpr {
  constructor(private value: number) {} // 고정 금액 할인
  interpret(amount: number) { return amount - this.value }
}
class CombinedDiscount implements DiscountExpr {
  constructor(private first: DiscountExpr, private second: DiscountExpr) {}
  interpret(amount: number) { return this.second.interpret(this.first.interpret(amount)) }
}

// 10% 할인 후 3,000원 추가 할인
const discount = new CombinedDiscount(
  new RateDiscount(0.1),
  new FixedDiscount(3000)
)
console.log(discount.interpret(50000)) // 50000 → 45000 → 42000

// 새 할인 규칙 추가 = 새 클래스만 추가 (기존 코드 수정 없음)`
    }
  }
]
