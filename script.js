// بيانات الأدمن الثابتة
const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASS = "admin1235";

// استرجاع المستخدمين من الذاكرة المحلية أو إنشاء مصفوفة فارغة
let usersDB = JSON.parse(localStorage.getItem('siteUsers')) || [];

// دالة التبديل بين الواجهات
function switchView(viewId) {
    document.querySelectorAll('.container > div').forEach(div => {
        div.classList.add('hidden-section');
        div.classList.remove('active-section');
    });
    document.getElementById(viewId).classList.remove('hidden-section');
    document.getElementById(viewId).classList.add('active-section');
}

function showRegister() { switchView('register-section'); }
function showLogin() { switchView('login-section'); }

// دالة إنشاء حساب جديد
function register() {
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;

    if (!email || !pass) {
        alert("الرجاء ملء جميع الحقول");
        return;
    }

    // التحقق مما إذا كان البريد مستخدم سابقاً
    const exists = usersDB.find(user => user.email === email);
    if (exists) {
        alert("هذا البريد مسجل بالفعل!");
        return;
    }

    // حفظ المستخدم
    usersDB.push({ email: email, password: pass });
    localStorage.setItem('siteUsers', JSON.stringify(usersDB));
    
    alert("تم إنشاء الحساب بنجاح! قم بتسجيل الدخول الآن.");
    showLogin();
}

// دالة تسجيل الدخول
function login() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;

    // 1. التحقق من الأدمن
    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
        loadAdminPanel();
        switchView('admin-dashboard');
        return;
    }

    // 2. التحقق من المستخدمين العاديين
    const user = usersDB.find(u => u.email === email && u.password === pass);
    
    if (user) {
        switchView('user-dashboard');
    } else {
        alert("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
}

// دالة توليد رقم عشوائي (1.00 - 30.60)
function generateNumber() {
    const min = 1.00;
    const max = 30.60;
    // معادلة لتوليد رقم عشوائي بكسور عشرية
    const randomNum = (Math.random() * (max - min) + min).toFixed(2);
    
    document.getElementById('random-number-display').innerText = randomNum;
}

// دالة تحميل لوحة الأدمن
function loadAdminPanel() {
    const list = document.getElementById('users-list');
    list.innerHTML = ""; // مسح القائمة الحالية

    if (usersDB.length === 0) {
        list.innerHTML = "<li>لا يوجد مستخدمين مسجلين حتى الآن.</li>";
        return;
    }

    usersDB.forEach((user, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. البريد: ${user.email} | كلمة المرور: ${user.password}`;
        list.appendChild(li);
    });
}

// تسجيل الخروج
function logout() {
    document.getElementById('login-email').value = "";
    document.getElementById('login-pass').value = "";
    document.getElementById('random-number-display').innerText = "0.00";
    showLogin();
}
