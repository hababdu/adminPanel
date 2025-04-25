import { createSlice } from '@reduxjs/toolkit';

// Kategoriyalar tartibi
const categoryOrder = {
  products: 1,
  users: 2,
  couriers: 3,
  orders: 4,
  analytics: 5,
  content: 6,
  system: 7,
  support: 8,
  other: 9,
};

// Boshlang'ich holat
const initialState = {
  abilities: [
    // Product Management
    {
      id: 'product-add',
      title: '🛒 Mahsulot qo‘shish',
      description: 'Yangi mahsulotlarni qo‘shish',
      icon: 'FiShoppingCart',
      path: '/add-product',
      category: 'products',
    },
    {
      id: 'product-list',
      title: '📦 Mahsulotlar ro‘yxati',
      description: 'Barcha mahsulotlarni ko‘rish va boshqarish',
      icon: 'FiList',
      path: '/products',
      category: 'products',
    },
    {
      id: 'product-categories',
      title: '🏷️ Kategoriyalar',
      description: 'Mahsulot kategoriyalarini boshqarish',
      icon: 'FiTag',
      path: '/categories',
      category: 'products',
    },
    {
      id: 'product-tags',
      title: '🏷️ Teglar',
      description: 'Mahsulot teglarini boshqarish',
      icon: 'FiTag',
      path: '/tags',
      category: 'products',
    },

    // User Management
    {
      id: 'user-list',
      title: '👤 Foydalanuvchilar',
      description: 'Foydalanuvchilar ro‘yxati va boshqaruvi',
      icon: 'FiUsers',
      path: '/users',
      category: 'users',
    },
    {
      id: 'admin-list',
      title: '👥 Adminlar',
      description: 'Adminlar ro‘yxati va huquqlarini boshqarish',
      icon: 'FiUserPlus',
      path: '/admins',
      category: 'users',
    },
    {
      id: 'roles',
      title: '🔐 Rol va huquqlar',
      description: 'Foydalanuvchi rollari va huquqlarini sozlash',
      icon: 'FiLock',
      path: '/roles',
      category: 'users',
    },

    // Courier Management
    {
      id: 'courier-list',
      title: '🛵 Kuryerlar ro‘yxati',
      description: 'Barcha kuryerlarni ko‘rish va boshqarish',
      icon: 'FiTruck',
      path: '/couriers',
      category: 'couriers',
    },
    {
      id: 'courier-add',
      title: '➕ Kuryer qo‘shish',
      description: 'Yangi kuryerni ishga qabul qilish',
      icon: 'FiUserPlus',
      path: '/add-courier',
      category: 'couriers',
    },
    {
      id: 'courier-track',
      title: '📍 Kuryer holati',
      description: 'Kuryerlarning joylashuvi va faolligini kuzatish',
      icon: 'FiMapPin',
      path: '/couriers-track',
      category: 'couriers',
    },
    {
      id: 'courier-stats',
      title: '📊 Kuryer statistikasi',
      description: 'Kuryerlarning ishlash ko‘rsatkichlari',
      icon: 'FiPieChart',
      path: '/couriers-stats',
      category: 'couriers',
    },

    // Order Management
    {
      id: 'order-list',
      title: '📝 Buyurtmalar',
      description: 'Barcha buyurtmalarni ko‘rish va boshqarish',
      icon: 'FiClipboard',
      path: '/orders',
      category: 'orders',
    },
    {
      id: 'order-status',
      title: '🔄 Buyurtma holati',
      description: 'Buyurtma holatlarini o‘zgartirish',
      icon: 'FiRefreshCw',
      path: '/order-status',
      category: 'orders',
    },
    {
      id: 'order-cancelled',
      title: '❌ Bekor qilingan buyurtmalar',
      description: 'Bekor qilingan buyurtmalar tarixi',
      icon: 'FiXCircle',
      path: '/cancelled-orders',
      category: 'orders',
    },

    // Analytics & Reports
    {
      id: 'statistics',
      title: '📈 Asosiy statistika',
      description: 'Saytdagi asosiy faoliyat ko‘rsatkichlari',
      icon: 'FiBarChart2',
      path: '/statistics',
      category: 'analytics',
    },
    {
      id: 'reports',
      title: '📊 Hisobotlar',
      description: 'Kunlik/oylik hisobotlarni yuklab olish',
      icon: 'FiDownload',
      path: '/reports',
      category: 'analytics',
    },
    {
      id: 'payments',
      title: '💰 To‘lovlar',
      description: 'To‘lovlar tarixi va boshqaruvi',
      icon: 'FiDollarSign',
      path: '/payments',
      category: 'analytics',
    },

    // Content Management
    {
      id: 'promotions',
      title: '📢 Reklamalar',
      description: 'Reklama bannerlari va aktsiyalarni boshqarish',
      icon: 'FiImage',
      path: '/promotions',
      category: 'content',
    },
    {
      id: 'blog',
      title: '📝 Blog',
      description: 'Blog postlarini boshqarish',
      icon: 'FiBookOpen',
      path: '/blog',
      category: 'content',
    },
    {
      id: 'messages',
      title: '✉️ Xabarlar',
      description: 'Foydalanuvchilardan kelgan xabarlar',
      icon: 'FiMail',
      path: '/messages',
      category: 'content',
    },

    // System Settings
    {
      id: 'settings',
      title: '⚙️ Sozlamalar',
      description: 'Tizim sozlamalari',
      icon: 'FiSettings',
      path: '/settings',
      category: 'system',
    },
    {
      id: 'updates',
      title: '🔄 Tizim yangiliklari',
      description: 'Tizim versiyasi va yangilanishlar',
      icon: 'FiUploadCloud',
      path: '/updates',
      category: 'system',
    },
    {
      id: 'logs',
      title: '📜 Loglar',
      description: 'Tizimdagi harakatlar tarixi',
      icon: 'FiActivity',
      path: '/logs',
      category: 'system',
    },

    // Customer Support
    {
      id: 'support',
      title: '🆔 Mijozlar qo‘llab-quvvatlash',
      description: 'Mijozlar shikoyatlari va so‘rovlari',
      icon: 'FiHeadphones',
      path: '/support',
      category: 'support',
    },
    {
      id: 'faq',
      title: '❓ FAQ',
      description: 'Ko‘p beriladigan savollarni boshqarish',
      icon: 'FiHelpCircle',
      path: '/faq',
      category: 'support',
    },
  ],
  activeTab: 'dashboard',
  error: null,
};

// Slice yaratish
const adminAbilitiesSlice = createSlice({
  name: 'adminAbilities',
  initialState,
  reducers: {
    // Aktiv tabni o'rnatish
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },

    // Yangi imkoniyat qo'shish
    addAbility: (state, action) => {
      const ability = action.payload;
      if (!ability.id || !ability.title || !ability.path) {
        state.error = 'ID, title, and path are required';
        return;
      }
      if (state.abilities.some(existing => existing.id === ability.id)) {
        state.error = 'Ability with this ID already exists';
        return;
      }
      state.abilities.push({
        ...ability,
        category: ability.category || 'other',
        description: ability.description || '',
        icon: ability.icon || 'FiLayers',
      });
      state.error = null;
    },

    // Imkoniyatni yangilash
    updateAbility: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.abilities.findIndex(ability => ability.id === id);
      if (index !== -1) {
        state.abilities[index] = { ...state.abilities[index], ...updates };
        state.error = null;
      } else {
        state.error = 'Ability not found';
      }
    },

    // Imkoniyatni o'chirish
    removeAbility: (state, action) => {
      const id = action.payload;
      const index = state.abilities.findIndex(ability => ability.id === id);
      if (index !== -1) {
        state.abilities.splice(index, 1);
        state.error = null;
      } else {
        state.error = 'Ability not found';
      }
    },

    // Xatolarni tozalash
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Aksiyalar
export const { setActiveTab, addAbility, updateAbility, removeAbility, clearError } =
  adminAbilitiesSlice.actions;

// Selektorlar
// Guruhlangan imkoniyatlar
export const selectGroupedAbilities = (state) => {
  const grouped = state.adminAbilities.abilities.reduce((acc, ability) => {
    const category = ability.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(ability);
    return acc;
  }, {});

  // Kategoriyalarni tartiblash
  return Object.keys(grouped)
    .sort((a, b) => (categoryOrder[a] || 999) - (categoryOrder[b] || 999))
    .reduce((sorted, category) => {
      sorted[category] = grouped[category];
      return sorted;
    }, {});
};

// Filtrlangan imkoniyatlar
export const selectFilteredAbilities = (searchQuery) => (state) => {
  const query = searchQuery.toLowerCase();
  return state.adminAbilities.abilities.filter(
    (ability) =>
      ability.title.toLowerCase().includes(query) ||
      (ability.description && ability.description.toLowerCase().includes(query))
  );
};

// Faol tab
export const selectActiveTab = (state) => state.adminAbilities.activeTab;

// Xato holati
export const selectError = (state) => state.adminAbilities.error;

export default adminAbilitiesSlice.reducer;