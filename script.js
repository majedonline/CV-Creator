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
    const saveBtn = document.getElementById('save-draft');
    const loadBtn = document.getElementById('load-draft');
    const experienceContainer = document.getElementById('experience-container');
    const educationContainer = document.getElementById('education-container');
    const photoInput = document.getElementById('photo');
    const summaryInput = document.getElementById('summary');
    const wordCount = document.getElementById('word-count');
    const themeSelect = document.getElementById('theme');
    let photoDataURL = '';

    // ====================================================================
    // الوظائف الأساسيّة
    // ====================================================================

    // عدّاد الكلمات للملخّص الشخصيّ
    summaryInput.addEventListener('input', () => {
        const words = summaryInput.value.trim().split(/\s+/).filter(Boolean);
        wordCount.textContent = `عدد الكلمات: ${words.length}`;
    });

    // وظيفة لإضافة حقل خبرة جديد
    function addExperienceField(data = {}) {
        const div = document.createElement('div');
        div.classList.add('experience-item-field');
        div.innerHTML = `
            <hr>
            <label>المسمّى الوظيفيّ:</label>
            <input type="text" class="job-title" placeholder="مدير مشروع" value="${data.jobTitle || ''}">
            <label>الشركة:</label>
            <input type="text" class="company" placeholder="شركة التكنولوجيا" value="${data.company || ''}">
            <label>فترة العمل:</label>
            <input type="text" class="work-period" placeholder="يناير 2020 - حتّى الآن" value="${data.period || ''}">
            <label>المهام والمسؤوليّات:</label>
            <textarea class="responsibilities" placeholder="أدرت فريقًا من 10 أفراد...">${data.responsibilities || ''}</textarea>
            <button type="button" class="remove-btn">إزالة</button>
        `;
        experienceContainer.appendChild(div);
    }

    // وظيفة لإضافة حقل تعليم جديد
    function addEducationField(data = {}) {
        const div = document.createElement('div');
        div.classList.add('education-item-field');
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

    // إضافة حقل واحد تلقائيًّا عند التحميل
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

    // ====================================================================
    // وظائف الحفظ والتحميل والتحكّم بالموقع
    // ====================================================================

    // تغيير الثيم (الألوان)
    themeSelect.addEventListener('change', (e) => {
        const theme = e.target.value;
        document.body.className = '';
        if (theme !== 'default') {
            document.body.classList.add(`${theme}-theme`);
        }
    });

    // وظيفة إعادة تعيين النموذج (لزر إنشاء سيرة جديدة)
    resetBtn.addEventListener('click', () => {
        if (confirm('هل أنت متأكّد من إنشاء سيرة جديدة؟ سيتمّ حذف جميع البيانات الحاليّة.')) {
            cvForm.reset();
            photoDataURL = '';
            while (experienceContainer.children.length > 0) {
                experienceContainer.removeChild(experienceContainer.lastChild);
            }
            while (educationContainer.children.length > 0) {
                educationContainer.removeChild(educationContainer.lastChild);
            }
            addExperienceField();
            addEducationField();
            wordCount.textContent = 'عدد الكلمات: 0';
            inputSection.classList.remove('hidden');
            previewSection.classList.add('hidden');
            localStorage.removeItem('cv_draft');
        }
    });

    // حفظ المسوّدة في الذاكرة المحلية للمتصفّح
    saveBtn.addEventListener('click', () => {
        const data = {
            name: document.getElementById('name').value,
            title: document.getElementById('title').value,
            summary: document.getElementById('summary').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            linkedin: document.getElementById('linkedin').value,
            github: document.getElementById('github').value,
            skills: document.querySelector('.skill-input').value,
            languages: document.querySelector('.language-input').value,
            experiences: Array.from(document.querySelectorAll('.experience-item-field')).map(item => ({
                jobTitle: item.querySelector('.job-title').value,
                company: item.querySelector('.company').value,
                period: item.querySelector('.work-period').value,
                responsibilities: item.querySelector('.responsibilities').value
            })),
            education: Array.from(document.querySelectorAll('.education-item-field')).map(item => ({
                degree: item.querySelector('.degree').value,
                university: item.querySelector('.university').value,
                year: item.querySelector('.graduation-year').value
            })),
            theme: themeSelect.value,
            photo: photoDataURL
        };
        localStorage.setItem('cv_draft', JSON.stringify(data));
        alert('تمّ حفظ المسوّدة بنجاح!');
    });

    // تحميل المسوّدة من الذاكرة المحلية
    loadBtn.addEventListener('click', () => {
        const savedData = localStorage.getItem('cv_draft');
        if (savedData) {
            const data = JSON.parse(savedData);
            document.getElementById('name').value = data.name;
            document.getElementById('title').value = data.title;
            document.getElementById('summary').value = data.summary;
            document.getElementById('email').value = data.email;
            document.getElementById('phone').value = data.phone;
            document.getElementById('linkedin').value = data.linkedin;
            document.getElementById('github').value = data.github;
            document.querySelector('.skill-input').value = data.skills;
            document.querySelector('.language-input').value = data.languages;
            themeSelect.value = data.theme;
            document.body.className = '';
            if (data.theme !== 'default') {
                document.body.classList.add(`${data.theme}-theme`);
            }
            photoDataURL = data.photo;

            // إعادة بناء حقول الخبرة
            experienceContainer.innerHTML = '';
            data.experiences.forEach(exp => addExperienceField(exp));

            // إعادة بناء حقول التعليم
            educationContainer.innerHTML = '';
            data.education.forEach(edu => addEducationField(edu));

            alert('تمّ تحميل المسوّدة بنجاح!');
        } else {
            alert('لا توجد مسوّدة محفوظة.');
        }
    });

    // ====================================================================
    // إنشاء ومعاينة السيرة الذاتيّة
    // ====================================================================

    // وظيفة لإنشاء ومعاينة السيرة الذاتيّة (زر المعاينة)
    cvForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const title = document.getElementById('title').value;
        const summary = document.getElementById('summary').value.replace(/\n/g, '<br>');
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const linkedin = document.getElementById('linkedin').value;
        const github = document.getElementById('github').value;
        const skills = document.querySelector('.skill-input').value.split(',').map(s => s.trim()).filter(Boolean);
        const languages = document.querySelector('.language-input').value.split(',').map(l => l.trim()).filter(Boolean);

        const experiences = Array.from(document.querySelectorAll('.experience-item-field')).map(item => ({
            jobTitle: item.querySelector('.job-title').value,
            company: item.querySelector('.company').value,
            period: item.querySelector('.work-period').value,
            responsibilities: item.querySelector('.responsibilities').value
        }));

        const education = Array.from(document.querySelectorAll('.education-item-field')).map(item => ({
            degree: item.querySelector('.degree').value,
            university: item.querySelector('.university').value,
            year: item.querySelector('.graduation-year').value
        }));

        // إنشاء هيكل HTML للسيرة الذاتيّة
        const htmlContent = `
            <div class="cv-body">
                <div class="left-column">
                    ${photoDataURL ? `<img src="${photoDataURL}" alt="صورة شخصيّة" class="profile-photo">` : ''}
                    <h3>معلومات الاتصال</h3>
                    <div class="contact-info">
                        <p><strong>البريد الإلكترونيّ:</strong> ${email}</p>
                        ${phone ? `<p><strong>رقم الهاتف:</strong> ${phone}</p>` : ''}
                    </div>
                    ${linkedin || github ? `
                    <h3>الروابط</h3>
                    <div class="social-links">
                        ${linkedin ? `<p><a href="${linkedin}" target="_blank">LinkedIn</a></p>` : ''}
                        ${github ? `<p><a href="${github}" target="_blank">GitHub</a></p>` : ''}
                    </div>
                    ` : ''}
                    ${skills.length > 0 ? `
                    <h3>المهارات</h3>
                    <ul class="skills-list">
                        ${skills.map(skill => `<li>${skill}</li>`).join('')}
                    </ul>` : ''}
                    ${languages.length > 0 ? `
                    <h3>اللغات</h3>
                    <ul class="languages-list">
                        ${languages.map(lang => `<li>${lang}</li>`).join('')}
                    </ul>` : ''}
                </div>
                <div class="right-column">
                    <h2>${name}</h2>
                    <p class="job-title-preview">${title}</p>
                    ${summary ? `
                    <h3>ملخّص شخصيّ</h3>
                    <p>${summary}</p>` : ''}
                    ${experiences.filter(exp => exp.jobTitle).length > 0 ? `
                    <h3>الخبرة العمليّة</h3>
                    <div class="experience-list">
                        ${experiences.filter(exp => exp.jobTitle).map(exp => `
                            <div class="experience-item">
                                <h4 class="job-title-preview-item">${exp.jobTitle}</h4>
                                <p class="company-preview"><strong>${exp.company}</strong> | <span class="work-period-preview">${exp.period}</span></p>
                                <p class="responsibilities-preview">${exp.responsibilities}</p>
                            </div>
                        `).join('')}
                    </div>` : ''}
                    ${education.filter(edu => edu.degree).length > 0 ? `
                    <h3>المؤهّلات العلميّة</h3>
                    <div class="education-list">
                        ${education.filter(edu => edu.degree).map(edu => `
                            <div class="education-item">
                                <h4 class="degree-preview-item">${edu.degree}</h4>
                                <p class="university-preview"><strong>${edu.university}</strong> (${edu.year})</p>
                            </div>
                        `).join('')}
                    </div>` : ''}
                </div>
            </div>
        `;
        
        cvPreview.innerHTML = htmlContent;
        inputSection.classList.add('hidden');
        previewSection.classList.remove('hidden');
    });

    // وظيفة للعودة إلى صفحة التعديل
    editCvBtn.addEventListener('click', () => {
        previewSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
    });

    // وظيفة تحميل السيرة الذاتيّة كملف PDF
    downloadCvBtn.addEventListener('click', () => {
        const element = document.getElementById('cv-preview').querySelector('.cv-body');
        html2pdf(element, {
            margin: [0, 0, 0, 0],
            filename: `${document.getElementById('name').value}_السيرة-الذاتية.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        });
    });
});
