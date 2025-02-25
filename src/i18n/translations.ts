export const translations = {
  en: {
    common: {
      settings: "Settings",
      save: "Save",
      cancel: "Cancel",
      loading: "Loading...",
      empty: "No items found",
      category: "Select Category",
      addToCart: "Add to Cart 🛒",
      emptyCart: "Your cart is empty",
      shoppingCart: "Shopping Cart",
      title: "Tax-Free Shopping Calculator",
      priceIn: "Price in",
      originalPrice: "Original Price",
      taxFreePrice: "Tax-Free Price",
      enterAmount: "Enter amount...",
      calculateTaxFree: "Calculate Tax-Free Price",
      off: "off",
      settings: "⚙️ Settings",
    },
    categories: {
      food: "Food & Drinks",
      tech: "Technology",
      fashion: "Fashion",
      transport: "Transportation",
      beauty: "Beauty & Health",
      gifts: "Gifts & Souvenirs",
      entertainment: "Entertainment",
      other: "Other",
    },
    analytics: {
      title: "Shopping Analysis",
      dailySpending: "Daily Tax-Free Shopping",
      byCategory: "Spending by Category",
      total: "Total",
    },
    favorites: {
      title: "Frequently Bought",
      show: "Show Frequently Bought",
      hide: "Hide Frequently Bought",
      timesBought: "times bought",
    },
    settings: {
      language: "Language",
      taxFree: "Tax-Free Settings",
      enableTaxFree: "Enable Tax-Free Calculation",
      taxFreeRate: "Tax-Free Rate",
      countries: "Country Settings",
      selectHome: "Select Home Country",
      selectTourist: "Select Tourist Country",
    },
  },
  ja: {
    common: {
      settings: "設定",
      save: "保存",
      cancel: "キャンセル",
      loading: "読み込み中...",
      empty: "アイテムが見つかりません",
      category: "カテゴリーを選択",
      addToCart: "カートに追加 🛒",
      emptyCart: "カートは空です",
      shoppingCart: "ショッピングカート",
      title: "免税計算機",
      priceIn: "価格",
      originalPrice: "元の価格",
      taxFreePrice: "免税価格",
      enterAmount: "金額を入力...",
      calculateTaxFree: "免税価格を計算",
      off: "オフ",
      settings: "⚙️ 設定",
    },
    categories: {
      food: "飲食",
      tech: "テクノロジー",
      fashion: "ファッション",
      transport: "交通",
      beauty: "美容・健康",
      gifts: "ギフト・お土産",
      entertainment: "エンターテイメント",
      other: "その他",
    },
    analytics: {
      title: "ショッピング分析",
      dailySpending: "免税品の日別購入",
      byCategory: "カテゴリー別支出",
      total: "合計",
    },
    favorites: {
      title: "よく購入する商品",
      show: "よく購入する商品を表示",
      hide: "よく購入する商品を非表示",
      timesBought: "回購入",
    },
    settings: {
      language: "言語",
      taxFree: "免税設定",
      enableTaxFree: "免税計算を有効にする",
      taxFreeRate: "免税率",
      countries: "国設定",
      selectHome: "居住国を選択",
      selectTourist: "旅行国を選択",
    },
  },
  tr: {
    common: {
      settings: "Ayarlar",
      save: "Kaydet",
      cancel: "İptal",
      loading: "Yükleniyor...",
      empty: "Öğe bulunamadı",
      category: "Kategori Seç",
      addToCart: "Sepete Ekle 🛒",
      emptyCart: "Sepetiniz boş",
      shoppingCart: "Alışveriş Sepeti",
      title: "Tax-Free Alışveriş Hesaplayıcı",
      priceIn: "Fiyat",
      originalPrice: "Orijinal Fiyat",
      taxFreePrice: "Tax-Free Fiyat",
      enterAmount: "Tutar girin...",
      calculateTaxFree: "Tax-Free Fiyat Hesapla",
      off: "indirim",
      settings: "⚙️ Ayarlar",
    },
    categories: {
      food: "Yeme & İçme",
      tech: "Teknoloji",
      fashion: "Giyim",
      transport: "Ulaşım",
      beauty: "Güzellik & Sağlık",
      gifts: "Hediyeler & Hediyelik",
      entertainment: "Eğlence",
      other: "Diğer",
    },
    analytics: {
      title: "Alışveriş Analizi",
      dailySpending: "Günlük Tax-Free Alışveriş",
      byCategory: "Kategoriye Göre Harcama",
      total: "Toplam",
    },
    favorites: {
      title: "Sık Alınanlar",
      show: "Sık Alınanları Göster",
      hide: "Sık Alınanları Gizle",
      timesBought: "kez alındı",
    },
    settings: {
      language: "Dil",
      taxFree: "Tax-Free Ayarları",
      enableTaxFree: "Tax-Free Hesaplamayı Etkinleştir",
      taxFreeRate: "Tax-Free Oranı",
      countries: "Ülke Ayarları",
      selectHome: "Yaşadığınız Ülkeyi Seçin",
      selectTourist: "Turist Ülkesini Seçin",
    },
  },
};

export type Language = keyof typeof translations;
