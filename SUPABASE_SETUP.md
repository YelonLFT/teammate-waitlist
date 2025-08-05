# Supabase Setup for Waitlist

## 1. 创建Supabase项目

1. 访问 [Supabase](https://supabase.com) 并创建新项目
2. 记录你的项目URL和匿名密钥

## 2. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. 基本配置（推荐）

目前应用使用简化的配置，只使用Supabase的默认用户认证：

1. 在Supabase Dashboard中进入 Authentication > Settings
2. 禁用 "Enable email confirmations" (因为我们不需要邮箱验证)
3. 或者配置SMTP设置以发送确认邮件

这样配置后，用户注册数据会保存在 `auth.users` 表中，包含用户名和邮箱信息。

## 4. 高级配置（可选）

如果你想要额外的数据存储，可以在Supabase SQL编辑器中运行以下SQL来创建waitlist_users表：

```sql
-- 创建waitlist_users表
CREATE TABLE waitlist_users (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_waitlist_users_email ON waitlist_users(email);
CREATE INDEX idx_waitlist_users_created_at ON waitlist_users(created_at);

-- 启用RLS (Row Level Security)
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;

-- 创建策略允许插入
CREATE POLICY "Allow insert for authenticated users" ON waitlist_users
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 创建策略允许用户查看自己的数据
CREATE POLICY "Allow users to view own data" ON waitlist_users
  FOR SELECT USING (auth.uid() = user_id);
```

然后修改 `app/context/AuthContext.tsx` 中的 `signUp` 函数，取消注释保存到 `waitlist_users` 表的代码。

## 5. 错误排查

如果遇到 "Error saving to waitlist_users" 错误：

1. **检查环境变量**：确保 `.env.local` 文件中的Supabase URL和密钥正确
2. **检查表是否存在**：在Supabase Dashboard中查看表是否已创建
3. **检查权限**：确保RLS策略正确配置
4. **查看控制台**：检查浏览器控制台的详细错误信息

## 6. 测试应用

运行开发服务器：

```bash
npm run dev
```

访问 http://localhost:3000 测试注册功能。

## 7. 查看数据

在Supabase Dashboard中：
- Authentication > Users：查看注册的用户
- Table Editor > waitlist_users：查看额外的用户数据（如果配置了） 