document.addEventListener('DOMContentLoaded', () => {
    const cvForm = document.getElementById('cv-form');
    const inputSection = document.getElementById('input-section');
    const previewSection = document.getElementById('preview-section');
    const cvPreview = document.getElementById('cv-preview');
    const addExperienceBtn = document.getElementById('add-experience');
    const addEducationBtn = document.getElementById('add-education');
    const downloadCvBtn = document.getElementById('download-cv');
    const editCvBtn = document.getElementById('edit-cv');
    const resetBtn = document.getElementById('reset-form');
    const experienceContainer = document.getElementById('experience-container');
    const educationContainer = document.getElementById('education-container');
    const photoInput = document.getElementById('photo');
    const summaryInput = document.getElementById('summary');
    const wordCount = document.getElementById('word-count');
    const themeSelect = document.getElementById('theme');
    let photoDataURL = '';

    // =========================
    // عداد الكلمات للملخص الشخصي
    // =========================
    summaryInput.addEventListener('input', () => {
        const words = summaryInput.value.trim().split(/\s+/).filter(Boolean);
        wordCount.textContent = `عدد الكلمات: ${words.length}`;
    });

    // =========================
    // الوظائف لإضافة حقول جديدة
    // =========================
    function addExperienceField(data = {}) {
        const div = document.createElement('div');
        div.classList.add('experience-item');
        div.innerHTML = `
            <hr>
            <label>المسمّى الوظيفيّ:</label>
            <input type="text" class="job-title" placeholder="مدير مشروع" value="${data.jobTitle || ''}">
            <label>الشركة:</label>
            <input type="text" class="company" placeholder="شركة التكنولوجيا" value="${data.company || ''}">
            <label>فترة العمل:</label>
            <input type="text" class="work-period" placeholder="يناير 2020 - حتّى الآن" value="${data.period || ''}">
            <label>المهام والمسؤوليات:</label>
            <textarea class="responsibilities" placeholder="أدرت فريقًا من 10 أفراد...">${data.responsibilities || ''}</textarea>
            <button type="button" class="remove-btn">إزالة</button>
        `;
        experienceContainer.appendChild(div);
    }

    function addEducationField(data = {}) {
        const div = document.createElement('div');
        div.classList.add('education-item');
        div.innerHTML = `
            <hr>
            <label>المؤهّل العلميّ:</label>
            <input type="text" class="degree" placeholder="بكالوريوس في علوم الحاسوب" value="${data.degree || ''}">
            <label>الجامعة/المؤسّسة:</label>
            <input type="text" class="university" placeholder="الجامعة الأميركية في بيروت" value="${data.university || ''}">
            <label>سنة التخرّج:</label>
            <input type="text" class="graduation-year" placeholder="2019" value="${data.year || ''}">
            <button type="button" class="remove-btn">إزالة</button>
        `;
        educationContainer.appendChild(div);
    }

    if (experienceContainer.children.length === 0) addExperienceField();
    if (educationContainer.children.length === 0) addEducationField();

    addExperienceBtn.addEventListener('click', () => addExperienceField());
    addEducationBtn.addEventListener('click', () => addEducationField());

    // إزالة الحقول
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            e.target.parentElement.remove();
        }
    });

    // تحميل الصورة
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => { photoDataURL = event.target.result; };
            reader.readAsDataURL(file);
        }
    });

    // =========================
    // إنشاء معاينة السيرة الذاتية
    // =========================
    cvForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.get
