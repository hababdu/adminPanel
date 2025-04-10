// store/adminAbilitiesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  abilities: [
    // Product Management
    { 
      title: "🛒 Mahsulot qo'shish", 
      description: "Yangi mahsulotlarni qo'shish", 
      icon: "FiShoppingCart", 
      path: "add-product",
      category: "products" 
    },
    { 
      title: "📦 Mahsulotlar ro'yxati", 
      description: "Barcha mahsulotlarni ko'rish va boshqarish", 
      icon: "FiList", 
      path: "products",
      category: "products" 
    },
    { 
      title: "🏷️ Kategoriyalar", 
      description: "Mahsulot kategoriyalarini boshqarish", 
      icon: "FiTag", 
      path: "categories",
      category: "products" 
    },
    { 
      title: "🏷️ Teglar", 
      description: "Mahsulot teglarini boshqarish", 
      icon: "FiTag", 
      path: "tags",
      category: "products" 
    },

    // User Management
    { 
      title: "👤 Foydalanuvchilar", 
      description: "Foydalanuvchilar ro'yxati va boshqaruvi", 
      icon: "FiUsers", 
      path: "users",
      category: "users" 
    },
    { 
      title: "👥 Adminlar", 
      description: "Adminlar ro'yxati va huquqlarini boshqarish", 
      icon: "FiUserPlus", 
      path: "admins",
      category: "users" 
    },
    { 
      title: "🔐 Rol va huquqlar", 
      description: "Foydalanuvchi rollari va huquqlarini sozlash", 
      icon: "FiLock", 
      path: "roles",
      category: "users" 
    },

    // Courier Management
    { 
      title: "🛵 Kuryerlar ro'yxati", 
      description: "Barcha kuryerlarni ko'rish va boshqarish", 
      icon: "FiTruck", 
      path: "couriers",
      category: "couriers" 
    },
    { 
      title: "➕ Kuryer qo'shish", 
      description: "Yangi kuryerni ishga qabul qilish", 
      icon: "FiUserPlus", 
      path: "add-courier",
      category: "couriers" 
    },
    { 
      title: "📍 Kuryer holati", 
      description: "Kuryerlarning joylashuvi va faolligini kuzatish", 
      icon: "FiMapPin", 
      path: "couriers-track",
      category: "couriers" 
    },
    { 
      title: "📊 Kuryer statistikasi", 
      description: "Kuryerlarning ishlash ko'rsatkichlari", 
      icon: "FiPieChart", 
      path: "couriers-stats",
      category: "couriers" 
    },

    // Order Management
    { 
      title: "📝 Buyurtmalar", 
      description: "Barcha buyurtmalarni ko'rish va boshqarish", 
      icon: "FiClipboard", 
      path: "orders",
      category: "orders" 
    },
    { 
      title: "🔄 Buyurtma holati", 
      description: "Buyurtma holatlarini o'zgartirish", 
      icon: "FiRefreshCw", 
      path: "order-status",
      category: "orders" 
    },
    { 
      title: "❌ Bekor qilingan buyurtmalar", 
      description: "Bekor qilingan buyurtmalar tarixi", 
      icon: "FiXCircle", 
      path: "cancelled-orders",
      category: "orders" 
    },

    // Analytics & Reports
    { 
      title: "📈 Asosiy statistika", 
      description: "Saytdagi asosiy faoliyat ko'rsatkichlari", 
      icon: "FiBarChart2", 
      path: "statistics",
      category: "analytics" 
    },
    { 
      title: "📊 Hisobotlar", 
      description: "Kunlik/oylik hisobotlarni yuklab olish", 
      icon: "FiDownload", 
      path: "reports",
      category: "analytics" 
    },
    { 
      title: "💰 To'lovlar", 
      description: "To'lovlar tarixi va boshqaruvi", 
      icon: "FiDollarSign", 
      path: "payments",
      category: "analytics" 
    },

    // Content Management
    { 
      title: "📢 Reklamalar", 
      description: "Reklama bannerlari va aktsiyalarni boshqarish", 
      icon: "FiImage", 
      path: "promotions",
      category: "content" 
    },
    { 
      title: "📝 Blog", 
      description: "Blog postlarini boshqarish", 
      icon: "FiBookOpen", 
      path: "blog",
      category: "content" 
    },
    { 
      title: "✉️ Xabarlar", 
      description: "Foydalanuvchilardan kelgan xabarlar", 
      icon: "FiMail", 
      path: "messages",
      category: "content" 
    },

    // System Settings
    { 
      title: "⚙️ Sozlamalar", 
      description: "Tizim sozlamalari", 
      icon: "FiSettings", 
      path: "settings",
      category: "system" 
    },
    { 
      title: "🔄 Tizim yangiliklari", 
      description: "Tizim versiyasi va yangilanishlar", 
      icon: "FiUploadCloud", 
      path: "updates",
      category: "system" 
    },
    { 
      title: "📜 Loglar", 
      description: "Tizimdagi harakatlar tarixi", 
      icon: "FiActivity", 
      path: "logs",
      category: "system" 
    },

    // Customer Support
    { 
      title: "🆔 Mijozlar qo'llab-quvvatlash", 
      description: "Mijozlar shikoyatlari va so'rovlari", 
      icon: "FiHeadphones", 
      path: "support",
      category: "support" 
    },
    { 
      title: "❓ FAQ", 
      description: "Ko'p beriladigan savollarni boshqarish", 
      icon: "FiHelpCircle", 
      path: "faq",
      category: "support" 
    }
  ],
  activeTab: "dashboard"
};

const adminAbilitiesSlice = createSlice({
  name: 'adminAbilities',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    // You can add more reducers here if needed
    // For example to add new abilities dynamically:
    addAbility: (state, action) => {
      state.abilities.push(action.payload);
    }
  }
});

export const { setActiveTab, addAbility } = adminAbilitiesSlice.actions;

// Selector for grouped abilities by category
export const selectGroupedAbilities = (state) => {
  return state.adminAbilities.abilities.reduce((acc, ability) => {
    const category = ability.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(ability);
    return acc;
  }, {});
};

export default adminAbilitiesSlice.reducer;