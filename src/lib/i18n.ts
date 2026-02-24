import { useLanguageStore, Language } from '@/presentation/stores/useLanguageStore';

// ─── Translation Dictionaries ────────────────────────────────────────────────

const translations: Record<Language, Record<string, string>> = {
    th: {
        // ── Common ──
        'app.name': 'Layr',
        'app.subtitle': 'จัดการเงินส่วนตัว',
        'app.tagline': 'เงินของคุณ กฎของคุณ ✨',
        'app.footer': 'สร้างด้วย 💜 โดย Layr Team • 2026',
        'common.loading': 'กำลังโหลด...',
        'common.error': 'เกิดข้อผิดพลาด',
        'common.save': 'บันทึก',
        'common.cancel': 'ยกเลิก',
        'common.delete': 'ลบ',
        'common.edit': 'แก้ไข',
        'common.add': 'เพิ่ม',
        'common.search': 'ค้นหา...',
        'common.viewAll': 'ดูทั้งหมด',
        'common.allTime': 'ทั้งหมด',
        'common.netWorth': 'ทรัพย์สินสุทธิ',
        'common.confirm': 'ยืนยัน',
        'common.saving': 'กำลังบันทึก...',
        'common.deleting': 'กำลังลบ...',
        'common.prev': 'ก่อนหน้า',
        'common.next': 'ถัดไป',
        'common.all': 'ทั้งหมด',
        'common.thisPage': 'หน้านี้',
        'common.selected': 'ที่เลือก',
        'common.selectAll': 'เลือกทั้งหมด',
        'common.failedToLoad': 'ไม่สามารถโหลดข้อมูลได้',
        'common.back': 'กลับ',
        'common.submit': 'บันทึก',

        // ── Navigation ──
        'nav.dashboard': 'แดชบอร์ด',
        'nav.transactions': 'รายการ',
        'nav.categories': 'หมวดหมู่',
        'nav.accounts': 'บัญชี',
        'nav.more': 'เพิ่มเติม',
        'nav.addNew': 'เพิ่มรายการ',
        'nav.uploadStatement': 'อัปโหลดใบแจ้งยอด',
        'nav.addManually': 'เพิ่มด้วยตัวเอง',
        'nav.proComingSoon': 'ฟีเจอร์ Pro เร็วๆ นี้!',

        // ── More Page ──
        'more.title': 'เพิ่มเติม ⚙️',
        'more.subtitle': 'จัดการแอปของคุณ',
        'more.categoryManagement': 'จัดการหมวดหมู่',
        'more.categoryManagementDesc': 'เพิ่ม แก้ไข และจัดการหมวดหมู่รายรับ-รายจ่าย',
        'more.settings': 'ตั้งค่า',
        'more.settingsDesc': 'ปรับแต่งการตั้งค่าแอปของคุณ',

        // ── Settings Page ──
        'settings.title': 'ตั้งค่า ⚙️',
        'settings.subtitle': 'ปรับแต่งแอปตามที่คุณต้องการ',
        'settings.language': 'ภาษา',
        'settings.version': 'เวอร์ชัน',
        'settings.general': 'ทั่วไป',
        'settings.about': 'เกี่ยวกับ',

        // ── Login ──
        'login.logIn': 'เข้าสู่ระบบ',
        'login.signUp': 'สมัครสมาชิก',
        'login.email': 'อีเมล',
        'login.password': 'รหัสผ่าน',
        'login.confirmPassword': 'ยืนยันรหัสผ่าน',
        'login.pleaseWait': 'กรุณารอ...',
        'login.createAccount': 'สร้างบัญชี',
        'login.passwordsMismatch': 'รหัสผ่านไม่ตรงกัน!',
        'login.passwordTooShort': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
        'login.accountCreated': 'สร้างบัญชีสำเร็จ! ตรวจสอบอีเมลเพื่อยืนยัน แล้วเข้าสู่ระบบ 🎉',
        'login.somethingWrong': 'มีบางอย่างผิดพลาด',

        // ── Dashboard ──
        'dashboard.title': 'แดชบอร์ด 📊',
        'dashboard.subtitle': 'สรุปภาพรวมการเงินของคุณ',
        'dashboard.totalIncome': 'รายรับรวม',
        'dashboard.totalExpenses': 'รายจ่ายรวม',
        'dashboard.balance': 'คงเหลือ',
        'dashboard.recentTransactions': 'รายการล่าสุด 💸',
        'dashboard.failedToLoad': 'ไม่สามารถโหลดข้อมูลแดชบอร์ดได้',

        // ── Empty States ──
        'empty.noTransactions': 'ยังไม่มีรายการ',
        'empty.noTransactionsDesc': 'เริ่มต้นด้วยการเพิ่มรายการแรก หรืออัปโหลดใบแจ้งยอดจากธนาคาร!',
        'empty.addTransaction': 'เพิ่มรายการ',
        'empty.noExpenses': 'ไม่มีรายจ่ายเดือนนี้',
        'empty.noAccounts': 'ยังไม่มีบัญชี',
        'empty.noAccountsDesc': 'เพิ่มบัญชีธนาคารหรือบัตรเครดิตเพื่อเริ่มติดตาม',
        'empty.addFirstAccount': 'เพิ่มบัญชีแรก',
        'empty.noSearchResults': 'ไม่พบรายการ',
        'empty.noSearchResultsDesc': 'ลองปรับตัวกรอง หรือเพิ่มรายการใหม่',
        'empty.noExpenseCategories': 'ยังไม่มีหมวดหมู่รายจ่าย',
        'empty.noIncomeCategories': 'ยังไม่มีหมวดหมู่รายรับ',

        // ── Calendar ──
        'calendar.expense': 'รายจ่าย',
        'calendar.income': 'รายรับ',
        'calendar.total': 'รวม',

        // ── Charts ──
        'chart.spendingByCategory': 'รายจ่ายตามหมวดหมู่ (รายเดือน)',
        'chart.financialOverview': 'ภาพรวมการเงิน',
        'chart.avgExpense': 'เฉลี่ย',

        // ── Header ──
        'header.profile': 'โปรไฟล์',
        'header.logout': 'ออกจากระบบ',
        'header.account': 'บัญชี Layr',

        // ── Landing ──
        'landing.openApp': 'เปิดแอป',
        'landing.hero': 'เงินของคุณ กฎของคุณ.',
        'landing.heroDesc': 'ติดตามรายจ่าย นำเข้าใบแจ้งยอดธนาคาร และบรรลุเป้าหมายงบประมาณ — ทุกอย่างในแอปเดียวที่ออกแบบมาเพื่อคุณ ✨',
        'landing.getStarted': 'เริ่มใช้งานฟรี',
        'landing.feature1': 'ติดตามรายจ่าย',
        'landing.feature1Desc': 'ดูว่าเงินหายไปไหนทุกบาท',
        'landing.feature2': 'นำเข้าใบแจ้งยอด',
        'landing.feature2Desc': 'อัปโหลด CSV จากธนาคาร',
        'landing.feature3': 'เป้าหมายงบประมาณ',
        'landing.feature3Desc': 'ตั้งเป้าหมาย & ไม่หลุดงบ',
        'landing.feature4': 'กราฟอัจฉริยะ',
        'landing.feature4Desc': 'แยกรายจ่ายสวยงาม',

        // ── Transactions Page ──
        'transactions.title': 'รายการ 💸',
        'transactions.expense': 'รายจ่าย',
        'transactions.income': 'รายรับ',
        'transactions.allCategories': 'ทุกหมวดหมู่',
        'transactions.failedToLoad': 'ไม่สามารถโหลดรายการได้',
        'transactions.deleteSelected': 'ลบรายการที่เลือก? 🗑️',
        'transactions.deleteSelectedMsg': 'ลบ {count} รายการ? การดำเนินนี้ไม่สามารถย้อนกลับได้',
        'transactions.deleteAll': 'ลบทั้งหมด',
        'transactions.setCategory': 'ตั้งหมวดหมู่...',

        // ── Transaction Form ──
        'txForm.newTransaction': 'รายการใหม่ 💸',
        'txForm.editTransaction': 'แก้ไขรายการ ✏️',
        'txForm.amount': 'จำนวนเงิน',
        'txForm.description': 'รายละเอียด',
        'txForm.descriptionPlaceholder': 'ใช้จ่ายอะไร?',
        'txForm.category': 'หมวดหมู่',
        'txForm.selectCategory': 'เลือก...',
        'txForm.date': 'วันที่',
        'txForm.account': 'บัญชี',
        'txForm.selectAccount': 'เลือกบัญชี',
        'txForm.saveTransaction': 'บันทึกรายการ',

        // ── Accounts Page ──
        'accounts.title': 'บัญชี 🏦',
        'accounts.subtitle': 'จัดการบัญชีธนาคารและบัตรเครดิต',
        'accounts.addAccount': 'เพิ่มบัญชี',
        'accounts.netBalance': 'ยอดคงเหลือสุทธิ',
        'accounts.across': 'จาก {count} บัญชี',
        'accounts.bankAccounts': '🏦 บัญชีธนาคาร',
        'accounts.creditCards': '💳 บัตรเครดิต',
        'accounts.balance': 'ยอดคงเหลือ',
        'accounts.outstanding': 'ยอดค้างชำระ',
        'accounts.bank': 'ธนาคาร',
        'accounts.credit': 'เครดิต',

        // ── Account Form ──
        'accountForm.addAccount': 'เพิ่มบัญชี 🏦',
        'accountForm.editAccount': 'แก้ไขบัญชี ✏️',
        'accountForm.accountName': 'ชื่อบัญชี',
        'accountForm.accountNamePlaceholder': 'เช่น ออมทรัพย์ กสิกร',
        'accountForm.accountType': 'ประเภทบัญชี',
        'accountForm.bankType': 'ธนาคาร',
        'accountForm.creditType': 'บัตรเครดิต',
        'accountForm.currentBalance': 'ยอดคงเหลือปัจจุบัน',
        'accountForm.bankName': 'ชื่อธนาคาร (ไม่บังคับ)',
        'accountForm.bankNamePlaceholder': 'เช่น ธนาคารกสิกรไทย',
        'accountForm.last4': 'เลขท้าย 4 หลัก (ไม่บังคับ)',
        'accountForm.create': 'สร้าง',
        'accountForm.update': 'อัพเดท',

        // ── Categories Page ──
        'categories.title': 'หมวดหมู่ 🏷️',
        'categories.subtitle': 'จัดการหมวดหมู่รายรับและรายจ่ายเพื่อติดตามที่ดีขึ้น',
        'categories.failedToLoad': 'ไม่สามารถโหลดหมวดหมู่ได้',
        'categories.newCategory': 'หมวดหมู่ใหม่ 🏷️',
        'categories.editCategory': 'แก้ไขหมวดหมู่ ✏️',
        'categories.categoryName': 'ชื่อหมวดหมู่',
        'categories.categoryNamePlaceholder': 'เช่น อาหาร',
        'categories.icon': 'ไอคอน',
        'categories.color': 'สี',
        'categories.saveChanges': 'บันทึกการเปลี่ยนแปลง',
        'categories.createCategory': 'สร้างหมวดหมู่',
        'categories.deleteCategory': 'ลบหมวดหมู่? 🗑️',
        'categories.deleteCategoryMsg': 'คุณแน่ใจหรือว่าต้องการลบ "{name}"? รายการในหมวดหมู่นี้จะไม่ถูกลบ แต่จะไม่มีหมวดหมู่',

        // ── Import ──
        'import.title': 'นำเข้าใบแจ้งยอด',
        'import.subtitle': 'อัปโหลดใบแจ้งยอดธนาคารเพื่อบันทึกรายจ่ายอัตโนมัติ',
        'import.passwordProtected': 'ไฟล์ PDF มีรหัสผ่านหรือเปล่า?',
        'import.enterPassword': 'กรอกรหัสผ่านถ้ามี',
        'import.parseStatement': 'วิเคราะห์ใบแจ้งยอด',
        'import.restoreLastSession': 'กู้คืนเซสชันล่าสุด',
        'import.analyzingStatement': 'กำลังวิเคราะห์ใบแจ้งยอด...',
        'import.extractingWithAI': 'กำลังดึงรายการด้วย AI ✨',
        'import.structuringData': 'กำลังจัดโครงสร้างข้อมูล...',
        'import.almostThere': 'เกือบเสร็จแล้ว!',
        'import.errorTitle': 'อ๊ะ! มีบางอย่างผิดพลาด',
        'import.errorDesc': 'ไม่สามารถวิเคราะห์ไฟล์นี้ได้ กรุณาลองอีกครั้งหรือตรวจสอบไฟล์',
        'import.tryAgain': 'ลองอีกครั้ง',
        'import.startOver': 'เริ่มใหม่',
        'import.import': 'นำเข้า',
        'import.targetAccount': 'บัญชีเป้าหมาย',
        'import.selectAccount': 'เลือกบัญชี...',
        'import.items': 'รายการ',
        'import.uncategorized': 'ไม่มีหมวดหมู่',
        'import.selectAccountFirst': 'กรุณาเลือกบัญชีก่อน',
        'import.importSuccess': 'นำเข้ารายการสำเร็จ!',
        'import.confirmStartOver': 'ยืนยันเริ่มใหม่ 🔄',
        'import.confirmStartOverMsg': 'ข้อมูลที่วิเคราะห์ไว้จะหายไป คุณแน่ใจหรือเปล่า?',
        'import.confirmClose': 'ปิดหน้าต่าง? 🚨',
        'import.confirmCloseMsg': 'ข้อมูลที่นำเข้าจะหายไป คุณแน่ใจหรือเปล่า?',
        'import.deleteSelected': 'ลบ {count} รายการที่เลือก?',
        'import.confirmDelete': 'ยืนยันลบ',
        'import.deleteMsg': 'ลบ "{name}" ({amount})?',
        'import.submit': 'บันทึก',
        'import.review': 'ตรวจสอบ',
        'import.reviewTitle': 'ตรวจสอบก่อนนำเข้า',
        'import.expenseTotal': 'รายจ่ายรวม',
        'import.incomeTotal': 'รายรับรวม',
        'import.categoryBreakdown': 'สรุปตามหมวดหมู่',

        // ── Confirm Dialog ──
        'confirm.delete': 'ยืนยันลบ',

        // ── File Upload ──
        'upload.dragDrop': 'ลากไฟล์มาวางที่นี่',
        'upload.or': 'หรือ',
        'upload.browse': 'เลือกไฟล์',
    },

    en: {
        // ── Common ──
        'app.name': 'Layr',
        'app.subtitle': 'Personal Finance',
        'app.tagline': 'Your money, your rules ✨',
        'app.footer': 'Built with 💜 by Layr Team • 2026',
        'common.loading': 'Loading...',
        'common.error': 'Something went wrong',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.add': 'Add',
        'common.search': 'Search...',
        'common.viewAll': 'View All',
        'common.allTime': 'All time',
        'common.netWorth': 'Net Worth',
        'common.confirm': 'Confirm',
        'common.saving': 'Saving...',
        'common.deleting': 'Deleting...',
        'common.prev': 'Prev',
        'common.next': 'Next',
        'common.all': 'All',
        'common.thisPage': 'This page',
        'common.selected': 'selected',
        'common.selectAll': 'Select all',
        'common.failedToLoad': 'Failed to load data',
        'common.back': 'Back',
        'common.submit': 'Submit',

        // ── Navigation ──
        'nav.dashboard': 'Dashboard',
        'nav.transactions': 'Transactions',
        'nav.categories': 'Categories',
        'nav.accounts': 'Accounts',
        'nav.more': 'More',
        'nav.addNew': 'Add New',
        'nav.uploadStatement': 'Upload Statement',
        'nav.addManually': 'Add Manually',
        'nav.proComingSoon': 'Pro features coming soon!',

        // ── More Page ──
        'more.title': 'More ⚙️',
        'more.subtitle': 'Manage your app',
        'more.categoryManagement': 'Category Management',
        'more.categoryManagementDesc': 'Add, edit, and manage your income & expense categories',
        'more.settings': 'Settings',
        'more.settingsDesc': 'Customize your app preferences',

        // ── Settings Page ──
        'settings.title': 'Settings ⚙️',
        'settings.subtitle': 'Customize the app to fit your needs',
        'settings.language': 'Language',
        'settings.version': 'Version',
        'settings.general': 'General',
        'settings.about': 'About',

        // ── Login ──
        'login.logIn': 'Log In',
        'login.signUp': 'Sign Up',
        'login.email': 'Email',
        'login.password': 'Password',
        'login.confirmPassword': 'Confirm Password',
        'login.pleaseWait': 'Please wait...',
        'login.createAccount': 'Create Account',
        'login.passwordsMismatch': 'Passwords don\'t match!',
        'login.passwordTooShort': 'Password must be at least 6 characters',
        'login.accountCreated': 'Account created! Check your email to confirm, then log in 🎉',
        'login.somethingWrong': 'Something went wrong',

        // ── Dashboard ──
        'dashboard.title': 'Dashboard 📊',
        'dashboard.subtitle': 'Here\'s what\'s happening with your money',
        'dashboard.totalIncome': 'Total Income',
        'dashboard.totalExpenses': 'Total Expenses',
        'dashboard.balance': 'Balance',
        'dashboard.recentTransactions': 'Recent Transactions 💸',
        'dashboard.failedToLoad': 'Failed to load dashboard data',

        // ── Empty States ──
        'empty.noTransactions': 'No transactions yet',
        'empty.noTransactionsDesc': 'Start by adding your first transaction or uploading a bank statement!',
        'empty.addTransaction': 'Add Transaction',
        'empty.noExpenses': 'No expenses this month',
        'empty.noAccounts': 'No accounts yet',
        'empty.noAccountsDesc': 'Add your bank accounts and credit cards to start tracking',
        'empty.addFirstAccount': 'Add Your First Account',
        'empty.noSearchResults': 'No transactions found',
        'empty.noSearchResultsDesc': 'Try adjusting your filters or add a new transaction',
        'empty.noExpenseCategories': 'No expense categories yet.',
        'empty.noIncomeCategories': 'No income categories yet.',

        // ── Calendar ──
        'calendar.expense': 'Expense',
        'calendar.income': 'Income',
        'calendar.total': 'Total',

        // ── Charts ──
        'chart.spendingByCategory': 'Spending by Category (Monthly)',
        'chart.financialOverview': 'Financial Overview',
        'chart.avgExpense': 'Avg. Exp',

        // ── Header ──
        'header.profile': 'Profile',
        'header.logout': 'Logout',
        'header.account': 'Layr Account',

        // ── Landing ──
        'landing.openApp': 'Open App',
        'landing.hero': 'Your Money, Your Rules.',
        'landing.heroDesc': 'Track expenses, import bank statements, and crush your budget goals — all in one beautiful app designed for the way you live. ✨',
        'landing.getStarted': 'Get Started Free',
        'landing.feature1': 'Expense Tracking',
        'landing.feature1Desc': 'See where every baht goes',
        'landing.feature2': 'Import Statements',
        'landing.feature2Desc': 'Upload CSV from your bank',
        'landing.feature3': 'Budget Goals',
        'landing.feature3Desc': 'Set targets & stay on track',
        'landing.feature4': 'Smart Charts',
        'landing.feature4Desc': 'Beautiful spending breakdowns',

        // ── Transactions Page ──
        'transactions.title': 'Transactions 💸',
        'transactions.expense': 'Expense',
        'transactions.income': 'Income',
        'transactions.allCategories': 'All Categories',
        'transactions.failedToLoad': 'Failed to load transactions',
        'transactions.deleteSelected': 'Delete Selected Transactions? 🗑️',
        'transactions.deleteSelectedMsg': 'Delete {count} transactions? This can\'t be undone.',
        'transactions.deleteAll': 'Delete All',
        'transactions.setCategory': 'Set Category...',

        // ── Transaction Form ──
        'txForm.newTransaction': 'New Transaction 💸',
        'txForm.editTransaction': 'Edit Transaction ✏️',
        'txForm.amount': 'Amount',
        'txForm.description': 'Description',
        'txForm.descriptionPlaceholder': 'What was this for?',
        'txForm.category': 'Category',
        'txForm.selectCategory': 'Select...',
        'txForm.date': 'Date',
        'txForm.account': 'Account',
        'txForm.selectAccount': 'Select Account',
        'txForm.saveTransaction': 'Save Transaction',

        // ── Accounts Page ──
        'accounts.title': 'Accounts 🏦',
        'accounts.subtitle': 'Manage your bank accounts and credit cards',
        'accounts.addAccount': 'Add Account',
        'accounts.netBalance': 'Net Balance',
        'accounts.across': 'Across {count} accounts',
        'accounts.bankAccounts': '🏦 Bank Accounts',
        'accounts.creditCards': '💳 Credit Cards',
        'accounts.balance': 'Balance',
        'accounts.outstanding': 'Outstanding',
        'accounts.bank': 'Bank',
        'accounts.credit': 'Credit',

        // ── Account Form ──
        'accountForm.addAccount': 'Add Account 🏦',
        'accountForm.editAccount': 'Edit Account ✏️',
        'accountForm.accountName': 'Account Name',
        'accountForm.accountNamePlaceholder': 'e.g. KBank Savings',
        'accountForm.accountType': 'Account Type',
        'accountForm.bankType': 'Bank',
        'accountForm.creditType': 'Credit Card',
        'accountForm.currentBalance': 'Current Balance',
        'accountForm.bankName': 'Bank Name (optional)',
        'accountForm.bankNamePlaceholder': 'e.g. Kasikorn Bank',
        'accountForm.last4': 'Last 4 digits (optional)',
        'accountForm.create': 'Create',
        'accountForm.update': 'Update',

        // ── Categories Page ──
        'categories.title': 'Categories 🏷️',
        'categories.subtitle': 'Manage your income and expense categories for better tracking',
        'categories.failedToLoad': 'Failed to load categories',
        'categories.newCategory': 'New Category 🏷️',
        'categories.editCategory': 'Edit Category ✏️',
        'categories.categoryName': 'Category Name',
        'categories.categoryNamePlaceholder': 'e.g. Groceries',
        'categories.icon': 'Icon',
        'categories.color': 'Color',
        'categories.saveChanges': 'Save Changes',
        'categories.createCategory': 'Create Category',
        'categories.deleteCategory': 'Delete Category? 🗑️',
        'categories.deleteCategoryMsg': 'Are you sure you want to delete "{name}"? Transactions in this category won\'t be deleted, just uncategorized.',

        // ── Import ──
        'import.title': 'Import Statement',
        'import.subtitle': 'Upload bank statements to auto-track expenses',
        'import.passwordProtected': 'Is this PDF password protected?',
        'import.enterPassword': 'Enter password if needed',
        'import.parseStatement': 'Parse Statement',
        'import.restoreLastSession': 'Restore last session',
        'import.analyzingStatement': 'Analyzing statement...',
        'import.extractingWithAI': 'Extracting transactions with AI ✨',
        'import.structuringData': 'Structuring Data...',
        'import.almostThere': 'Almost there!',
        'import.errorTitle': 'Oops! Something went wrong.',
        'import.errorDesc': 'We couldn\'t parse that file. Please try again or check if the file is valid.',
        'import.tryAgain': 'Try Again',
        'import.startOver': 'Start Over',
        'import.import': 'Import',
        'import.targetAccount': 'Target Account',
        'import.selectAccount': 'Select Account...',
        'import.items': 'items',
        'import.uncategorized': 'Uncategorized',
        'import.selectAccountFirst': 'Please select an account',
        'import.importSuccess': 'Transactions imported successfully!',
        'import.confirmStartOver': 'Confirm Start Over 🔄',
        'import.confirmStartOverMsg': 'All analyzed data will be lost. Are you sure?',
        'import.confirmClose': 'Close import? 🚨',
        'import.confirmCloseMsg': 'Your imported data will be lost. Are you sure?',
        'import.deleteSelected': 'Delete {count} selected transactions?',
        'import.confirmDelete': 'Confirm Delete',
        'import.deleteMsg': 'Delete "{name}" ({amount})?',
        'import.submit': 'Submit',
        'import.review': 'Review',
        'import.reviewTitle': 'Review Import',
        'import.expenseTotal': 'Expense Total',
        'import.incomeTotal': 'Income Total',
        'import.categoryBreakdown': 'By Category',

        // ── Confirm Dialog ──
        'confirm.delete': 'Confirm Delete',

        // ── File Upload ──
        'upload.dragDrop': 'Drag & drop files here',
        'upload.or': 'or',
        'upload.browse': 'Browse files',
    },
};

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useTranslation() {
    const language = useLanguageStore((s) => s.language);

    const t = (key: string, params?: Record<string, string | number>): string => {
        let value = translations[language][key] || translations['en'][key] || key;
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                value = value.replace(`{${k}}`, String(v));
            });
        }
        return value;
    };

    return { t, language };
}
