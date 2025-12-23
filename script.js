/* script.js */

// ==========================================
// 1. ضع إعدادات فايربيس الخاصة بك هنا
// ==========================================
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ==========================================
// 2. وظائف صفحة إنشاء الكود
// ==========================================

// دالة لتحويل الصورة إلى نص (Base64) لتخزينها بسهولة
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

async function submitRequest() {
    const userData = document.getElementById('userData').value;
    const regProofFile = document.getElementById('regProof').files[0];
    const depProofFile = document.getElementById('depProof').files[0];
    const btn = document.getElementById('submitBtn');

    if (!userData || !regProofFile || !depProofFile) {
        alert("يرجى ملء الخانة ورفع الصورتين");
        return;
    }

    // توليد كود عشوائي
    const generatedCode = 'CODE-' + Math.floor(100000 + Math.random() * 900000);

    btn.innerText = "جاري المعالجة...";
    btn.disabled = true;

    try {
        // تحويل الصور لنصوص للتخزين
        const regBase64 = await toBase64(regProofFile);
        const depBase64 = await toBase64(depProofFile);

        // حفظ البيانات في Firebase
        await db.collection("requests").add({
            userData: userData,
            registrationProof: regBase64,
            depositProof: depBase64,
            generatedCode: generatedCode,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // إظهار النتيجة للمستخدم
        document.getElementById('codeDisplay').classList.remove('hidden');
        document.getElementById('generatedCode').innerText = generatedCode;
        
        // حفظ الكود في قاعدة البيانات لغرض التحقق لاحقاً
        await db.collection("active_codes").add({
            code: generatedCode,
            used: false
        });

        btn.style.display = 'none';

    } catch (error) {
        console.error("Error: ", error);
        alert("حدث خطأ، تأكد من الاتصال بالإنترنت");
        btn.innerText = "إنشاء الكود";
        btn.disabled = false;
    }
}

// ==========================================
// 3. وظائف صفحة تسجيل الدخول
// ==========================================
async function login() {
    const code = document.getElementById('accessCode').value.trim();
    if (!code) return;

    try {
        // البحث عن الكود في قاعدة البيانات
        const snapshot = await db.collection("active_codes").where("code", "==", code).get();

        if (!snapshot.empty) {
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'app.html';
        } else {
            alert("الكود غير صحيح");
        }
    } catch (error) {
        console.log(error);
        // في حالة لم تقم بإعداد فايربيس بشكل صحيح، هذا كود احتياطي للتجربة فقط
        if(code.startsWith("CODE-")) {
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'app.html';
        } else {
            alert("تأكد من إعدادات قاعدة البيانات");
        }
    }
}

// ==========================================
// 4. وظائف صفحة الأدمن
// ==========================================
function adminAuth() {
    const email = document.getElementById('adminEmail').value;
    const pass = document.getElementById('adminPass').value;

    if (email === "mazen@admin.com" && pass === "mazen250999") {
        document.getElementById('adminLogin').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        loadRequests();
    } else {
        alert("بيانات الدخول غير صحيحة");
    }
}

function loadRequests() {
    const list = document.getElementById('requestsList');
    list.innerHTML = '';

    db.collection("requests").orderBy("timestamp", "desc").get().then((querySnapshot) => {
        if(querySnapshot.empty) {
            list.innerHTML = "<p>لا توجد طلبات حالياً</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const item = document.createElement('div');
            item.className = 'request-item';
            item.innerHTML = `
                <p><strong>البيانات:</strong> ${data.userData}</p>
                <p><strong>الكود المولد:</strong> <span style="color:#4caf50">${data.generatedCode}</span></p>
                <div>
                    <p>الصور:</p>
                    <a href="${data.registrationProof}" target="_blank"><img src="${data.registrationProof}" title="دليل التسجيل"></a>
                    <a href="${data.depositProof}" target="_blank"><img src="${data.depositProof}" title="دليل الإيداع"></a>
                </div>
                <small>${new Date(data.timestamp.seconds * 1000).toLocaleString()}</small>
            `;
            list.appendChild(item);
        });
    }).catch((error) => {
        list.innerHTML = "<p>حدث خطأ في جلب البيانات، تأكد من إعدادات Firebase Rules</p>";
        console.error(error);
    });
}
