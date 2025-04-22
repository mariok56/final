export const ShopHero = () => {
    return (
      <div className="relative bg-[url(/shop-hero.jpg)] bg-cover bg-center h-64 md:h-80">
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Our Products</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto px-4">
              Premium hair care products used and recommended by our stylists
            </p>
          </div>
        </div>
      </div>
    );
  };