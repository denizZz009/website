"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, CreditCard, Truck, Shield } from "lucide-react";

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [shippingOption, setShippingOption] = useState("free");
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [total, setTotal] = useState(0);

  // Load cart from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          setCartItems(parsedCart);

          // Calculate subtotal
          const calculatedSubtotal = parsedCart.reduce((total, item) => total + (item.price * item.quantity), 0);
          setSubtotal(calculatedSubtotal);

          // Set initial shipping cost (free for orders over 500 TL)
          if (calculatedSubtotal >= 500) {
            setShippingCost(0);
          }

          // Calculate total
          setTotal(calculatedSubtotal + shippingCost - discount);
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Update total when shipping or discount changes
  useEffect(() => {
    setTotal(subtotal + shippingCost - discount);
  }, [subtotal, shippingCost, discount]);

  // Handle shipping option change
  const handleShippingOptionChange = (option) => {
    setShippingOption(option);
    if (option === "express") {
      setShippingCost(60);
    } else {
      // Free shipping for orders over 500 TL, otherwise 30 TL
      setShippingCost(subtotal >= 500 ? 0 : 30);
    }
  };

  // Form fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    zipCode: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when typing
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  // Validate shipping info
  const validateShipping = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName) newErrors.fullName = "Ad Soyad gerekli";
    if (!formData.email) newErrors.email = "E-posta gerekli";
    if (!formData.phone) newErrors.phone = "Telefon gerekli";
    if (!formData.address) newErrors.address = "Adres gerekli";
    if (!formData.city) newErrors.city = "Şehir gerekli";
    if (!formData.district) newErrors.district = "İlçe gerekli";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate payment info
  const validatePayment = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber) newErrors.cardNumber = "Kart numarası gerekli";
    if (!formData.cardName) newErrors.cardName = "Kart üzerindeki isim gerekli";
    if (!formData.expiryDate) newErrors.expiryDate = "Son kullanma tarihi gerekli";
    if (!formData.cvv) newErrors.cvv = "CVV gerekli";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Go to payment step
  const goToPayment = () => {
    if (validateShipping()) {
      setCurrentStep(2);
      window.scrollTo(0, 0);
    }
  };

  // Go back to shipping step
  const goToShipping = () => {
    setCurrentStep(1);
    window.scrollTo(0, 0);
  };

  // Complete order
  const completeOrder = () => {
    if (validatePayment()) {
      setIsProcessing(true);
      setTimeout(() => {
        window.location.href = "/odeme/basarili";
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="pt-20 pb-8 border-b border-white/10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Ödeme</h1>

          <div className="flex items-center">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-white text-black' : 'bg-gray-700 text-gray-300'}`}>
                <span>1</span>
              </div>
              <span className={`ml-2 ${currentStep >= 1 ? 'text-white' : 'text-gray-400'}`}>Teslimat</span>
            </div>

            <div className={`flex-1 h-0.5 mx-4 ${currentStep >= 2 ? 'bg-white' : 'bg-gray-700'}`}></div>

            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-white text-black' : 'bg-gray-700 text-gray-300'}`}>
                <span>2</span>
              </div>
              <span className={`ml-2 ${currentStep >= 2 ? 'text-white' : 'text-gray-400'}`}>Ödeme</span>
            </div>

            <div className="flex-1 h-0.5 mx-4 bg-gray-700"></div>

            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-700 text-gray-300">
                <span>3</span>
              </div>
              <span className="ml-2 text-gray-400">Onay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side - forms */}
          <div className="lg:col-span-2">
            {currentStep === 1 ? (
              <div className="space-y-6">
                <div className="bg-black border border-white/10 rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Teslimat Bilgileri</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm">Ad Soyad *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full p-3 bg-black border ${errors.fullName ? 'border-red-500' : 'border-white/20'} rounded-md text-white`}
                        placeholder="Ad Soyad"
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block mb-2 text-sm">E-posta *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-3 bg-black border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-md text-white`}
                        placeholder="ornek@mail.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block mb-2 text-sm">Telefon *</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full p-3 bg-black border ${errors.phone ? 'border-red-500' : 'border-white/20'} rounded-md text-white`}
                        placeholder="05XX XXX XX XX"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm">Adres *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`w-full p-3 bg-black border ${errors.address ? 'border-red-500' : 'border-white/20'} rounded-md text-white`}
                        placeholder="Adres satırı"
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block mb-2 text-sm">Şehir *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full p-3 bg-black border ${errors.city ? 'border-red-500' : 'border-white/20'} rounded-md text-white`}
                        placeholder="Şehir"
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block mb-2 text-sm">İlçe *</label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className={`w-full p-3 bg-black border ${errors.district ? 'border-red-500' : 'border-white/20'} rounded-md text-white`}
                        placeholder="İlçe"
                      />
                      {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                    </div>

                    <div>
                      <label className="block mb-2 text-sm">Posta Kodu</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full p-3 bg-black border border-white/20 rounded-md text-white"
                        placeholder="Posta Kodu"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={goToPayment}
                      className="px-4 py-2 bg-white text-black rounded hover:bg-white/90 font-medium"
                    >
                      Ödeme Adımına İlerle
                    </button>
                  </div>
                </div>

                <div className="bg-black border border-white/10 rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Teslimat Yöntemi</h2>

                  <div className="space-y-3">
                    <div
                      className={`flex items-center space-x-3 p-3 border ${shippingOption === "free" ? 'border-white/50 bg-white/5' : 'border-white/20'} rounded-lg cursor-pointer hover:bg-white/5 transition-colors`}
                      onClick={() => handleShippingOptionChange("free")}
                    >
                      <input
                        type="radio"
                        id="free"
                        name="delivery"
                        checked={shippingOption === "free"}
                        onChange={() => handleShippingOptionChange("free")}
                        className="h-4 w-4 text-white"
                      />
                      <div className="flex-1">
                        <label htmlFor="free" className="font-medium cursor-pointer">
                          Ücretsiz Kargo
                        </label>
                        <p className="text-sm text-gray-400">3-5 iş günü</p>
                      </div>
                      <span className="font-medium">{subtotal >= 500 ? "Ücretsiz" : "₺30.00"}</span>
                    </div>

                    <div
                      className={`flex items-center space-x-3 p-3 border ${shippingOption === "express" ? 'border-white/50 bg-white/5' : 'border-white/20'} rounded-lg cursor-pointer hover:bg-white/5 transition-colors`}
                      onClick={() => handleShippingOptionChange("express")}
                    >
                      <input
                        type="radio"
                        id="express"
                        name="delivery"
                        checked={shippingOption === "express"}
                        onChange={() => handleShippingOptionChange("express")}
                        className="h-4 w-4"
                      />
                      <div className="flex-1">
                        <label htmlFor="express" className="font-medium cursor-pointer">Hızlı Teslimat</label>
                        <p className="text-sm text-gray-400">1-2 iş günü</p>
                      </div>
                      <span className="font-medium">₺60.00</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-4">
                    * 500₺ ve üzeri siparişlerde standart kargo ücretsizdir.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-black border border-white/10 rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Ödeme Bilgileri</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm">Kart Numarası *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                        </span>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          placeholder="1234 5678 9012 3456"
                          className={`w-full p-3 pl-10 bg-black border ${errors.cardNumber ? 'border-red-500' : 'border-white/20'} rounded-md text-white`}
                          maxLength={19}
                        />
                      </div>
                      {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div>
                      <label className="block mb-2 text-sm">Kart Üzerindeki İsim *</label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        placeholder="AD SOYAD"
                        className={`w-full p-3 bg-black border ${errors.cardName ? 'border-red-500' : 'border-white/20'} rounded-md text-white`}
                      />
                      {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm">Son Kullanma Tarihi *</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          placeholder="AA/YY"
                          className={`w-full p-3 bg-black border ${errors.expiryDate ? 'border-red-500' : 'border-white/20'} rounded-md text-white`}
                          maxLength={5}
                        />
                        {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                      </div>

                      <div>
                        <label className="block mb-2 text-sm">CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          placeholder="123"
                          className={`w-full p-3 bg-black border ${errors.cvv ? 'border-red-500' : 'border-white/20'} rounded-md text-white`}
                          maxLength={4}
                        />
                        {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 mr-2" />
                        <span className="text-sm">Kart bilgilerimi güvenli bir şekilde kaydet</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3 justify-between">
                    <button
                      onClick={goToShipping}
                      className="px-4 py-2 bg-transparent text-white border border-white/20 rounded hover:bg-white/10 font-medium flex items-center"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Teslimat Bilgilerine Dön
                    </button>

                    <button
                      onClick={completeOrder}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-white text-black rounded hover:bg-white/90 font-medium disabled:opacity-50"
                    >
                      {isProcessing ? "İşleniyor..." : "Siparişi Tamamla"}
                    </button>
                  </div>
                </div>

                <div className="bg-black border border-white/10 rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4">Ödeme Güvenliği</h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">Güvenli Ödeme</p>
                        <p className="text-sm text-gray-400">
                          Tüm ödemeler 256-bit SSL şifrelemesi ile güvenle işlenir.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right side - order summary */}
          <div>
            <div className="bg-black border border-white/10 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Sipariş Özeti</h2>

              <div className="mb-4">
                <div className="py-2 border-b border-white/10">
                  <h3 className="font-medium mb-1">{cartItems.length} Ürün</h3>
                </div>

                <div className="py-2 space-y-2 max-h-40 overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <p className="text-gray-300 truncate">
                        {item.name}
                        {item.size && <span className="text-gray-400"> - {item.size}</span>}
                        <span className="text-gray-400"> x{item.quantity}</span>
                      </p>
                      <p className="text-white whitespace-nowrap ml-2">₺{(item.price * item.quantity).toLocaleString('tr-TR')}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 my-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Ara Toplam</span>
                  <span className="text-white">₺{subtotal.toLocaleString('tr-TR')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">İndirim</span>
                    <span className="text-white">-₺{discount.toLocaleString('tr-TR')}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Kargo</span>
                  <span className="text-white">
                    {shippingCost === 0 ? "Ücretsiz" : `₺${shippingCost.toLocaleString('tr-TR')}`}
                  </span>
                </div>

                <div className="border-t border-white/10 pt-3 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-white">Toplam</span>
                    <span className="text-white">₺{total.toLocaleString('tr-TR')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 text-sm">
                <div className="flex items-center mb-4">
                  <Truck className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-400">
                    Tahmini Teslimat: {shippingOption === "express" ? "1-2 İş Günü" : "3-5 İş Günü"}
                  </span>
                </div>

                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-400">Güvenli Ödeme Sistemi</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => window.location.href = "/sepet"}
                  className="w-full py-2 px-4 bg-transparent text-left text-gray-400 hover:text-white flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Sepete Dön
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
