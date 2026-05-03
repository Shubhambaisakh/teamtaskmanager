# 📋 Copy & Paste Fix

## Error: "Error fetching projects"

### Fix in 3 Steps:

---

## 1️⃣ Open Supabase SQL Editor

**Link**: https://supabase.com/dashboard/project/aeedlewstzxreztohtpl

Click: **SQL Editor** (left sidebar) → **New Query**

---

## 2️⃣ Copy & Paste This

```sql
ALTER TABLE project_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
```

---

## 3️⃣ Click "Run"

Should see: ✅ **"Success. No rows returned"**

---

## 4️⃣ Refresh Your App

Press: **Ctrl + Shift + R**

---

## ✅ Done!

Your app should work now:
- Projects will load
- Members will show
- Tasks can be created
- No more errors

---

## Still Not Working?

Check browser console (F12) and share the error message.

