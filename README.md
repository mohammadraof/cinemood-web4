# CINEMOOD — بخش وب ۴ (React + TypeScript)

**چالش چهارشنبه‌های آیولرن**
**نام:** محمدرئوف محمدی 
**بخش:** وب ۴ — اپلیکیشن کامل سینمود
**دمو آنلاین:** [لینک، در صورت دیپلوی]

سینمود یک SPA واکنش‌گرا است: کاربر حالش را انتخاب می‌کند و فیلم‌های مناسب همان حال را می‌بیند.

## اجرا

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # بررسی TypeScript و ساخت نسخه‌ی نهایی
npm run preview
```

نیازمندی: Node.js نسخه‌ی LTS.

## حداقل‌های بخش (همه انجام شده)

- Router با ۵ مسیر: `/` (خانه)، `/movies`، `/mood` («حالم چطوره؟»)، `/movie/:id` (جزئیات) و `/dashboard`
- صفحه‌ی «حالم چطوره؟»: انتخاب یکی از ۵ حال قرارداد (`happy`, `sad`, `angry`, `surprise`, `neutral`) و نمایش فیلم‌های مناسب، مرتب‌شده بر اساس امتیاز
- کامپوننت‌های جدا: `MovieCard`، `MoodPicker`، `Header`، `Footer` و ... با props و state
- خواندن داده با `fetch` داخل `useEffect` از `public/movies.json` (فایل نمونه‌ی ۲۴ فیلم)؛ در صورت خطا، نسخه‌ی داخلی `src/data/movies.json` جایگزین می‌شود
- TypeScript با حالت `strict` و `interface Movie` (`src/types.ts`)

## امتیازهای اضافه

- داشبورد سلیقه‌ی کاربر: تعداد فیلم‌های ذخیره‌شده، میانگین امتیاز، ژانرهای محبوب و آخرین حال
- ذخیره‌ی علاقه‌مندی‌ها، آخرین حال و تم در `localStorage`
- پشتیبانی از فارسی (RTL) و انگلیسی (LTR)، تم تیره و روشن، و رنگ‌بندی صفحه بر اساس حال
- جست‌وجو و فیلتر در صفحه‌ی فیلم‌ها
- پخش تریلر از آپارات و لینک تماشا در پلتفرم‌ها در صفحه‌ی جزئیات
- طراحی واکنش‌گرا، پشتیبانی از `prefers-reduced-motion` و انیمیشن عنوان صفحه‌ی اصلی

## اتصال اختیاری به بک‌اند

مقدار `VITE_API_BASE_URL` را در فایل `.env` (کپی `.env.example`) تنظیم کن. برنامه از `GET ${VITE_API_BASE_URL}/movies` آرایه‌ای از فیلم‌ها با همین فرمت می‌خواند. بدون این متغیر، از `public/movies.json` استفاده می‌شود.

## فرمت داده

هر فیلم: `id`, `title`, `title_fa`, `year`, `genres`, `moods`, `rating`, `poster`. فیلدهای اختیاری: `runtime`, `director`, `synopsis`, `synopsis_en`, `aparatId`, `watchProviders`.

## ساختار

```text
public/        movies.json, favicon.svg, posters/
src/
  components/  Header, Footer, MovieCard, MoodPicker, MovieWatchActions, Dropdown
  pages/       Home, Movies, Mood, MovieDetail, Dashboard
  lib/         api.ts, storage.ts, i18n.ts, useWobble.ts
  data/        movies.json (نسخه‌ی پشتیبان داخلی)
  types.ts
  main.tsx
  styles.css
```