import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const menuItems = [
  {
    id: 1,
    name: 'GLITCH BURGER',
    description: 'Двойная котлета, копченый бекон, сырный соус, карамелизированный лук',
    price: '450₽',
    image: 'https://cdn.poehali.dev/projects/2be2d697-25c1-478c-ab7e-25b1a8fe7977/files/be1722c6-de3a-4b2c-92af-dd21d3b4a425.jpg',
    category: 'бургеры'
  },
  {
    id: 2,
    name: 'CYBER RAMEN',
    description: 'Пряный бульон тонкоцу, яйцо, свинина чашу, бамбук, водоросли нори',
    price: '520₽',
    image: 'https://cdn.poehali.dev/projects/2be2d697-25c1-478c-ab7e-25b1a8fe7977/files/44a63d76-ec9f-481e-ac2b-118cda36f6e8.jpg',
    category: 'азия'
  },
  {
    id: 3,
    name: 'NEON PIZZA',
    description: 'Пепперони, моцарелла, томатный соус, базилик, острый перец',
    price: '380₽',
    image: 'https://cdn.poehali.dev/projects/2be2d697-25c1-478c-ab7e-25b1a8fe7977/files/4a976994-d4b5-4d29-9ec1-b944e84ff8fa.jpg',
    category: 'пицца'
  },
  {
    id: 4,
    name: 'DARK BOWL',
    description: 'Черный рис, курица терияки, авокадо, эдамаме, кунжут',
    price: '420₽',
    image: 'https://cdn.poehali.dev/projects/2be2d697-25c1-478c-ab7e-25b1a8fe7977/files/44a63d76-ec9f-481e-ac2b-118cda36f6e8.jpg',
    category: 'азия'
  },
  {
    id: 5,
    name: 'STREET TACOS',
    description: 'Три мини-тако с говядиной, сальса, гуакамоле, лайм',
    price: '340₽',
    image: 'https://cdn.poehali.dev/projects/2be2d697-25c1-478c-ab7e-25b1a8fe7977/files/be1722c6-de3a-4b2c-92af-dd21d3b4a425.jpg',
    category: 'стрит-фуд'
  },
  {
    id: 6,
    name: 'INDIE WRAP',
    description: 'Курица гриль, овощи, соус ранч, сыр чеддер в тортилье',
    price: '290₽',
    image: 'https://cdn.poehali.dev/projects/2be2d697-25c1-478c-ab7e-25b1a8fe7977/files/be1722c6-de3a-4b2c-92af-dd21d3b4a425.jpg',
    category: 'стрит-фуд'
  }
];

interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  };

  const addToCart = (item: typeof menuItems[0]) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    toast({
      title: 'Добавлено в корзину',
      description: `${item.name} добавлен в корзину`,
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, change: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseInt(item.price.replace('₽', ''));
      return total + price * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-primary/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-primary glitch" data-text="INDIE EAT">
              INDIE EAT
            </h1>
            <div className="hidden md:flex gap-6">
              {['home', 'menu', 'delivery', 'contacts'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-sm uppercase tracking-wider transition-colors hover:text-primary ${
                    activeSection === section ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {section === 'home' ? 'Главная' : section === 'menu' ? 'Меню' : section === 'delivery' ? 'Доставка' : 'Контакты'}
                </button>
              ))}
            </div>
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 relative">
                  <Icon name="ShoppingCart" size={20} className="mr-2" />
                  Корзина
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-secondary text-white px-2 py-1">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-bold text-primary">Корзина</SheetTitle>
                  <SheetDescription>
                    {cart.length === 0 ? 'Ваша корзина пуста' : `Товаров в корзине: ${getTotalItems()}`}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-8 space-y-4 max-h-[60vh] overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-muted rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-muted-foreground">{item.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Icon name="Minus" size={16} />
                          </Button>
                          <span className="font-bold">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Icon name="Plus" size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="ml-auto"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {cart.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Итого:</span>
                        <span className="text-primary">{getTotalPrice()}₽</span>
                      </div>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-lg py-6">
                      Оформить заказ
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]" />
        <img src="https://cdn.poehali.dev/files/58096693-f9cc-4536-b6e8-ba2ed4cdb6ef.png" alt="" className="absolute top-32 right-20 w-32 h-auto opacity-60 animate-pulse pointer-events-none" />
        <img src="https://cdn.poehali.dev/files/2513c132-a318-412f-9cb6-78a29eab9269.jpeg" alt="" className="absolute bottom-32 left-16 w-16 h-auto opacity-40 rotate-45 pointer-events-none" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-7xl md:text-9xl font-bold mb-6 glitch" data-text="INDIE EAT">
              INDIE EAT
            </h2>
            <p className="text-2xl md:text-3xl text-muted-foreground mb-8 uppercase tracking-wide">
              Вкус без границ. Доставка в твой район.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-lg px-8"
                onClick={() => scrollToSection('menu')}
              >
                <Icon name="UtensilsCrossed" size={24} className="mr-2" />
                Смотреть меню
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white text-lg px-8"
                onClick={() => scrollToSection('delivery')}
              >
                <Icon name="Truck" size={24} className="mr-2" />
                Условия доставки
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="py-20 relative">
        <img src="https://cdn.poehali.dev/files/da2b9ac6-883f-43ae-a6e9-d6a22ee4bf00.jpg" alt="" className="absolute top-10 left-10 w-48 h-auto opacity-30 pointer-events-none" />
        <img src="https://cdn.poehali.dev/files/2513c132-a318-412f-9cb6-78a29eab9269.jpeg" alt="" className="absolute top-20 right-16 w-20 h-auto opacity-50 -rotate-12 pointer-events-none" />
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-center glitch" data-text="МЕНЮ">
            МЕНЮ
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Откройте для себя наши уникальные блюда
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Card 
                key={item.id} 
                className="bg-card border-primary/20 overflow-hidden group hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                <div className="relative overflow-hidden h-64">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-secondary text-white px-3 py-1 rounded-full text-sm font-bold">
                    {item.category}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-primary">{item.name}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{item.price}</span>
                    <Button 
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => addToCart(item)}
                    >
                      <Icon name="Plus" size={20} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="delivery" className="py-20 bg-muted/30 relative">
        <img src="https://cdn.poehali.dev/files/58096693-f9cc-4536-b6e8-ba2ed4cdb6ef.png" alt="" className="absolute bottom-20 right-10 w-40 h-auto opacity-40 animate-pulse pointer-events-none" />
        <img src="https://cdn.poehali.dev/files/2513c132-a318-412f-9cb6-78a29eab9269.jpeg" alt="" className="absolute top-10 left-1/4 w-12 h-auto opacity-30 rotate-90 pointer-events-none" />
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-center glitch" data-text="ДОСТАВКА">
            ДОСТАВКА
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Быстро. Надежно. Вкусно.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-card border-primary/20 p-8 text-center hover:border-primary transition-all">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Clock" size={32} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">30-45 минут</h3>
              <p className="text-muted-foreground">Среднее время доставки по городу</p>
            </Card>
            
            <Card className="bg-card border-primary/20 p-8 text-center hover:border-primary transition-all">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Banknote" size={32} className="text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Бесплатно от 1000₽</h3>
              <p className="text-muted-foreground">При заказе от 1000₽ доставка в подарок</p>
            </Card>
            
            <Card className="bg-card border-primary/20 p-8 text-center hover:border-primary transition-all">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="MapPin" size={32} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Весь ульяновск</h3>
              <p className="text-muted-foreground"></p>
            </Card>
          </div>

          <div className="mt-12 max-w-2xl mx-auto bg-card border border-primary/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4 text-center">Зоны доставки</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-muted">
                <span className="text-muted-foreground">В пределах МКАД</span>
                <span className="font-bold text-primary">Бесплатно от 1000₽</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-muted">
                <span className="text-muted-foreground">До 5 км за МКАД</span>
                <span className="font-bold">200₽</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">5-10 км за МКАД</span>
                <span className="font-bold">350₽</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-20 relative">
        <img src="https://cdn.poehali.dev/files/da2b9ac6-883f-43ae-a6e9-d6a22ee4bf00.jpg" alt="" className="absolute top-1/2 right-10 w-56 h-auto opacity-20 -translate-y-1/2 pointer-events-none" />
        <img src="https://cdn.poehali.dev/files/58096693-f9cc-4536-b6e8-ba2ed4cdb6ef.png" alt="" className="absolute bottom-10 left-20 w-24 h-auto opacity-50 pointer-events-none" />
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-center glitch" data-text="КОНТАКТЫ">
            КОНТАКТЫ
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Свяжитесь с нами любым удобным способом
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="bg-card border-primary/20 p-8">
              <h3 className="text-2xl font-bold mb-6">Написать нам</h3>
              <form className="space-y-4">
                <div>
                  <Input 
                    placeholder="Ваше имя" 
                    className="bg-muted border-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <Input 
                    type="email" 
                    placeholder="Email" 
                    className="bg-muted border-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <Input 
                    type="tel" 
                    placeholder="Телефон" 
                    className="bg-muted border-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <Textarea 
                    placeholder="Ваше сообщение" 
                    rows={4}
                    className="bg-muted border-primary/20 focus:border-primary resize-none"
                  />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Отправить
                </Button>
              </form>
            </Card>
            
            <div className="space-y-6">
              <Card className="bg-card border-primary/20 p-6 hover:border-primary transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Phone" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Телефон</h4>
                    <p className="text-muted-foreground">+7 (915) 405-72-33</p>
                    <p className="text-sm text-muted-foreground mt-1">Ежедневно с 9:00 до 21:00</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-card border-primary/20 p-6 hover:border-primary transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Mail" size={24} className="text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Email</h4>
                    <p className="text-muted-foreground">junromosa@yandex.ru</p>
                    <p className="text-sm text-muted-foreground mt-1">Ответим в течение 24 часов</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-card border-primary/20 p-6 hover:border-primary transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="MessageCircle" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Социальные сети</h4>
                    <div className="flex gap-3 mt-2">
                      <Button size="sm" variant="outline" className="border-primary/20 hover:bg-primary hover:text-white">
                        <Icon name="Instagram" size={18} />
                      </Button>
                      <Button size="sm" variant="outline" className="border-primary/20 hover:bg-primary hover:text-white">
                        <Icon name="Send" size={18} />
                      </Button>
                      <Button size="sm" variant="outline" className="border-primary/20 hover:bg-primary hover:text-white">
                        <Icon name="MessageSquare" size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-muted/30 border-t border-primary/20 py-8 relative">
        <img src="https://cdn.poehali.dev/files/2513c132-a318-412f-9cb6-78a29eab9269.jpeg" alt="" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-auto opacity-20 pointer-events-none" />
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-primary mb-2 glitch" data-text="INDIE EAT">
            INDIE EAT
          </h3>
          <p className="text-muted-foreground text-sm">
            © 2025 INDIE EAT. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;