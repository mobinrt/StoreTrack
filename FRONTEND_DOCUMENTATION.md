# توضیح کامل Frontend پروژه StoreTrack

## 🏗️ معماری کلی
این پروژه با **Next.js 15** (React Framework) نوشته شده و از **TypeScript** برای type safety استفاده میکنه. معماری پروژه بر اساس **Component-Based Architecture** و **State Management** با Zustand هست.

## 📁 ساختار پوشه‌ها

### **`/src/pages`** - صفحات اصلی
- **`index.tsx`** - داشبورد اصلی با نمودارها و آمار
- **`items/index.tsx`** - مدیریت کالاها (CRUD عملیات)
- **`orders/index.tsx`** - مدیریت سفارشات
- **`stock-history/index.tsx`** - تاریخچه تغییرات موجودی
- **`reports/index.tsx`** - گزارشات فروش و موجودی
- **`users/index.tsx`** - مدیریت کاربران (فقط admin)
- **`login.tsx`** - صفحه ورود
- **`register.tsx`** - صفحه ثبت‌نام
- **`_app.tsx`** - تنظیمات اصلی Next.js
- **`_document.tsx`** - تنظیمات HTML

### **`/src/components`** - کامپوننت‌ها

#### **Layout:**
- **`Layout.tsx`** - قالب اصلی (sidebar + header + content)
- **`Sidebar.tsx`** - منوی کناری با لینک‌های navigation
- **`Header.tsx`** - هدر بالای صفحه با منوی کاربر

#### **UI:**
- **`Button.tsx`** - دکمه با variants مختلف
- **`Input.tsx`** - فیلد ورودی با validation
- **`Loading.tsx`** - نمایش حالت loading
- **`Modal.tsx`** - پنجره modal عمومی
- **`Table.tsx`** - جدول با امکانات sort و pagination

#### **Dashboard:**
- **`StatsCard.tsx`** - کارت نمایش آمار
- **`SalesChart.tsx`** - نمودار فروش
- **`LowStockAlert.tsx`** - هشدار کمبود موجودی
- **`RecentOrders.tsx`** - لیست آخرین سفارشات

### **`/src/hooks`** - Custom Hooks

- **`useItems.ts`** - مدیریت state کالاها (CRUD)
- **`useOrders.ts`** - مدیریت state سفارشات
- **`useUsers.ts`** - مدیریت state کاربران
- **`useReports.ts`** - دریافت گزارشات
- **`useAuth.ts`** - احراز هویت

### **`/src/store`** - State Management (Zustand)

- **`auth.ts`** - ذخیره اطلاعات کاربر، token، role
- **`ui.ts`** - state های UI (sidebar, loading, page title)

### **`/src/lib`** - کتابخانه‌ها و utilities

- **`api.ts`** - تنظیمات axios و API endpoints
- **`utils.ts`** - توابع کمکی
- **`constants.ts`** - ثابت‌های پروژه

### **`/src/types`** - TypeScript Types

- **`index.ts`** - تعریف همه interface ها و type ها

## 🔧 تکنولوژی‌ها

### **Core:**
- **Next.js 15** - React Framework با SSR
- **TypeScript** - Type Safety
- **React 18** - UI Library

### **State & Data:**
- **Zustand** - State Management (سبک‌تر از Redux)
- **React Query (TanStack Query)** - Server State Management و caching
- **Axios** - HTTP Client

### **UI & Styling:**
- **Tailwind CSS** - Utility-first CSS
- **Headless UI** - Unstyled Components
- **Hero Icons** - آیکون‌ها
- **React Hook Form** - مدیریت فرم‌ها

## 🔄 Data Flow

1. **کاربر** → action انجام میده (کلیک/تایپ)
2. **Component** → custom hook صدا میزنه
3. **Hook** → از React Query استفاده میکنه
4. **React Query** → API call با axios
5. **Backend** → response برمیگردونه
6. **React Query** → cache میکنه و update میکنه
7. **Component** → re-render با دیتای جدید

## 🔐 احراز هویت

- **JWT Token** در localStorage ذخیره میشه
- **Axios Interceptor** توکن رو به همه request ها اضافه میکنه
- **Role-based** دسترسی (admin/staff)
- **Protected Routes** با بررسی در Layout component

## 📊 صفحات مهم

### **Dashboard:**
- نمایش آمار کلی (تعداد کالا، سفارشات، درآمد)
- نمودار فروش ماهانه
- هشدار کمبود موجودی
- لیست آخرین سفارشات

### **Items Management:**
- جدول کالاها با فیلتر و جستجو
- افزودن/ویرایش/حذف کالا
- Modal برای عملیات CRUD

### **Orders:**
- ثبت سفارش جدید
- تغییر وضعیت سفارش
- نمایش جزئیات و محاسبه قیمت کل
- فیلتر بر اساس وضعیت

## 🎨 طراحی UI

- **Responsive Design** - سازگار با موبایل و دسکتاپ
- **Clean & Modern** - طراحی مینیمال و تمیز
- **Consistent** - استفاده از کامپوننت‌های reusable
- **Dark Mode Ready** - آماده برای اضافه کردن dark mode

## 🚀 بهینه‌سازی‌ها

- **Code Splitting** - هر صفحه جداگانه load میشه
- **React Query Cache** - کاهش درخواست‌های تکراری
- **Optimistic Updates** - UI سریع‌تر update میشه
- **TypeScript** - کاهش خطاهای runtime

## 📝 نکات مهم

1. همه API calls از طریق hooks انجام میشه
2. Error handling در سطح hook انجام میشه
3. Loading states با React Query مدیریت میشن
4. Form validation با react-hook-form
5. همه components strongly typed هستن

## 🗂️ API Endpoints

### **Authentication:**
- `POST /api/auth/login` - ورود کاربر
- `POST /api/auth/register` - ثبت‌نام کاربر جدید

### **Items:**
- `GET /api/items` - دریافت لیست کالاها
- `GET /api/items/:id` - دریافت یک کالا
- `POST /api/items` - ایجاد کالای جدید
- `PUT /api/items/:id` - ویرایش کالا
- `DELETE /api/items/:id` - حذف کالا

### **Orders:**
- `GET /api/orders` - دریافت لیست سفارشات
- `GET /api/orders/:id` - دریافت یک سفارش
- `POST /api/orders` - ثبت سفارش جدید
- `PUT /api/orders/:id/status` - تغییر وضعیت سفارش

### **Users:**
- `GET /api/users` - دریافت لیست کاربران (admin only)
- `DELETE /api/users/:id` - حذف کاربر (admin only)

### **Reports:**
- `GET /api/reports/low-stock` - گزارش کمبود موجودی
- `GET /api/reports/sales` - گزارش فروش

### **Stock History:**
- `GET /api/stock-history` - تاریخچه تغییرات موجودی

## 🛠️ راه‌اندازی پروژه

```bash
# نصب dependencies
cd frontend
npm install

# اجرای development server
npm run dev

# ساخت production build
npm run build

# اجرای production server
npm start
```

## 🔑 Environment Variables

فایل `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 📱 Responsive Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

## 🎯 آینده پروژه

- [ ] اضافه کردن Dark Mode
- [ ] پیاده‌سازی PWA
- [ ] اضافه کردن Chart های بیشتر
- [ ] Export گزارشات به PDF/Excel
- [ ] Real-time updates با WebSocket
- [ ] Multi-language support

این معماری امکان توسعه آسان، تست‌پذیری بالا و performance خوب رو فراهم میکنه.