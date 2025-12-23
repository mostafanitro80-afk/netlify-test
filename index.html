<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نظام الوصول</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h2>نظام تسجيل الدخول</h2>
        <p style="color: var(--text-dim); font-size: 0.9rem;">الشبكة مؤمنة. يرجى إدخال مفتاح الوصول.</p>
        
        <input type="text" id="accessCode" placeholder="أدخل الكود هنا..." style="text-align: center; direction: ltr;">
        
        <button id="loginBtn">بدء الاتصال</button>
        <button class="secondary-btn" onclick="window.location.href='create.html'">طلب كود وصول جديد</button>
        
        </div>

    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script>
        const SUPABASE_URL = 'https://zflgifemhopabfzgczgs.supabase.co';
        const SUPABASE_KEY = 'sb_publishable_9xZcd3BkgL6cEQwHJitrew_mbX74lJW';
        const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

        async function runLogin() {
            const codeInput = document.getElementById('accessCode').value.trim();
            const btn = document.getElementById('loginBtn');
            
            if (!codeInput) { alert("يرجى إدخال الكود"); return; }

            btn.innerText = "جاري التحقق...";
            btn.disabled = true;

            try {
                const { data, error } = await _supabase
                    .from('active_codes')
                    .select('*')
                    .eq('code', codeInput);

                if (data && data.length > 0) {
                    localStorage.setItem('isLoggedIn', 'true');
                    window.location.href = 'app.html';
                } else {
                    alert("الكود غير صحيح أو منتهي الصلاحية");
                    btn.innerText = "بدء الاتصال";
                    btn.disabled = false;
                }
            } catch (err) {
                alert("خطأ في الاتصال");
                btn.disabled = false;
            }
        }
        document.getElementById('loginBtn').addEventListener('click', runLogin);
    </script>
</body>
</html>
