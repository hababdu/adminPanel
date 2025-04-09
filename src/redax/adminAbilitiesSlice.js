// store/adminAbilitiesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  abilities: [
    // Product Management
    { title: "🛒 Mahsulot qo'shish", description: "Yangi mahsulotlarni qo'shish", icon: "FiShoppingCart", path: "add-product" },
    { title: "📦 Mahsulotlar ro'yxati", description: "Barcha mahsulotlarni ko'rish va boshqarish", icon: "FiList", path: "products" },
    { title: "🏷️ Kategoriyalar", description: "Mahsulot kategoriyalarini boshqarish", icon: "FiTag", path: "categories" },
    { title: "🏷️ Teglar", description: "Mahsulot teglarini boshqarish", icon: "FiTag", path: "tags" },

    // User Management
    { title: "👤 Foydalanuvchilar", description: "Foydalanuvchilar ro'yxati va boshqaruvi", icon: "FiUsers", path: "users" },
    { title: "👥 Adminlar", description: "Adminlar ro'yxati va huquqlarini boshqarish", icon: "FiUserPlus", path: "admins" },
    { title: "🔐 Rol va huquqlar", description: "Foydalanuvchi rollari va huquqlarini sozlash", icon: "FiLock", path: "roles" },

    // Courier Management
    { title: "🛵 Kuryerlar ro'yxati", description: "Barcha kuryerlarni ko'rish va boshqarish", icon: "FiTruck", path: "couriers" },
    { title: "➕ Kuryer qo'shish", description: "Yangi kuryerni ishga qabul qilish", icon: "FiUserPlus", path: "add-courier" },
    { title: "📍 Kuryer holati", description: "Kuryerlarning joylashuvi va faolligini kuzatish", icon: "FiMapPin", path: "couriers-track" },
    { title: "📊 Kuryer statistikasi", description: "Kuryerlarning ishlash ko'rsatkichlari", icon: "FiPieChart", path: "couriers-stats" },

    // Order Management
    { title: "📝 Buyurtmalar", description: "Barcha buyurtmalarni ko'rish va boshqarish", icon: "FiClipboard", path: "orders" },
    { title: "🔄 Buyurtma holati", description: "Buyurtma holatlarini o'zgartirish", icon: "FiRefreshCw", path: "order-status" },
    { title: "❌ Bekor qilingan buyurtmalar", description: "Bekor qilingan buyurtmalar tarixi", icon: "FiXCircle", path: "cancelled-orders" },

    // Analytics & Reports
    { title: "📈 Asosiy statistika", description: "Saytdagi asosiy faoliyat ko'rsatkichlari", icon: "FiBarChart2", path: "statistics" },
    { title: "📊 Hisobotlar", description: "Kunlik/oylik hisobotlarni yuklab olish", icon: "FiDownload", path: "reports" },
    { title: "💰 To'lovlar", description: "To'lovlar tarixi va boshqaruvi", icon: "FiDollarSign", path: "payments" },

    // Content Management
    { title: "📢 Reklamalar", description: "Reklama bannerlari va aktsiyalarni boshqarish", icon: "FiImage", path: "promotions" },
    { title: "📝 Blog", description: "Blog postlarini boshqarish", icon: "FiBookOpen", path: "blog" },
    { title: "✉️ Xabarlar", description: "Foydalanuvchilardan kelgan xabarlar", icon: "FiMail", path: "messages" },

    // System Settings
    { title: "⚙️ Sozlamalar", description: "Tizim sozlamalari", icon: "FiSettings", path: "settings" },
    { title: "🔄 Tizim yangiliklari", description: "Tizim versiyasi va yangilanishlar", icon: "FiUploadCloud", path: "updates" },
    { title: "📜 Loglar", description: "Tizimdagi harakatlar tarixi", icon: "FiActivity", path: "logs" },

    // Customer Support
    { title: "🆔 Mijozlar qo'llab-quvvatlash", description: "Mijozlar shikoyatlari va so'rovlari", icon: "FiHeadphones", path: "support" },
    { title: "❓ FAQ", description: "Ko'p beriladigan savollarni boshqarish", icon: "FiHelpCircle", path: "faq" }
  ],
  activeTab: "dashboard"
};

const adminAbilitiesSlice = createSlice({
  name: 'adminAbilities',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    }
  }
});

export const { setActiveTab } = adminAbilitiesSlice.actions;
export default adminAbilitiesSlice.reducer;
