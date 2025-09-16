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

    // ====================================================================
    // وظائف أساسيّة: عدّاد الكلمات، إضافة حقول، تحميل صورة
    // ====================================================================

    // عدّاد الكلمات للملخّص الشخصيّ
    summaryInput.addEventListener('input', () => {
        const words = summaryInput.value.trim().split(/\s+/).filter(Boolean);
        wordCount.textContent = `عدد الكلمات: ${words.length}`;
    });

    // وظيفة لإضافة حقل خبرة جديد
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
            <label>المهام والمسؤوليّات:</label>
            <textarea class="responsibilities" placeholder="أدرت فريقًا من 10 أفراد...">${data.responsibilities || ''}</textarea>
            <button type="button" class="remove-btn">إزالة</button>
        `;
        experienceContainer.appendChild(div);
    }

    // وظيفة لإضافة حقل تعليم جديد
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
    // وظائف التخصيص والتحكّم بالموقع
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
        cvForm.reset();
        photoDataURL = '';
        // إزالة جميع حقول الخبرة والتعليم ما عدا الأول
        while (experienceContainer.children.length > 1) {
            experienceContainer.removeChild(experienceContainer.lastChild);
        }
        while (educationContainer.children.length > 1) {
            educationContainer.removeChild(educationContainer.lastChild);
        }
        wordCount.textContent = 'عدد الكلمات: 0';
        inputSection.classList.remove('hidden');
        previewSection.classList.add('hidden');
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

        // جمع بيانات الخبرات
        const experiences = [];
        document.querySelectorAll('.experience-item').forEach(item => {
            experiences.push({
                jobTitle: item.querySelector('.job-title').value,
                company: item.querySelector('.company').value,
                period: item.querySelector('.work-period').value,
                responsibilities: item.querySelector('.responsibilities').value
            });
        });

        // جمع بيانات التعليم
        const education = [];
        document.querySelectorAll('.education-item').forEach(item => {
            education.push({
                degree: item.querySelector('.degree').value,
                university: item.querySelector('.university').value,
                year: item.querySelector('.graduation-year').value
            });
        });

        // إنشاء هيكل HTML للسيرة الذاتيّة
        const htmlContent = `
            <div class="cv-body">
                <div class="cv-header">
                    ${photoDataURL ? `<img src="${photoDataURL}" alt="صورة شخصيّة" class="profile-photo">` : ''}
                    <div>
                        <h2>${name}</h2>
                        <p class="job-title-preview">${title}</p>
                        <div class="contact-info">
                            <p>${email}</p>
                            ${phone ? `<p>${phone}</p>` : ''}
                        </div>
                        <div class="social-links">
                            ${linkedin ? `<a href="${linkedin}" target="_blank">LinkedIn</a>` : ''}
                            ${github ? `<a href="${github}" target="_blank">GitHub</a>` : ''}
                        </div>
                    </div>
                </div>
                ${summary ? `<h3>ملخّص شخصيّ</h3><p>${summary}</p>` : ''}
                
                ${experiences.filter(exp => exp.jobTitle).length > 0 ? `<h3>الخبرة العمليّة</h3><ul class="experience-list">
                    ${experiences.filter(exp => exp.jobTitle).map(exp => `
                        <li>
                            <strong>${exp.jobTitle}</strong>، ${exp.company}
                            <p class="work-period-preview">${exp.period}</p>
                            <p>${exp.responsibilities}</p>
                        </li>
                    `).join('')}
                </ul>` : ''}

                ${education.filter(edu => edu.degree).length > 0 ? `<h3>المؤهّلات العلميّة</h3><ul class="education-list">
                    ${education.filter(edu => edu.degree).map(edu => `
                        <li>
                            <strong>${edu.degree}</strong> من ${edu.university} (${edu.year})
                        </li>
                    `).join('')}
                </ul>` : ''}
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
        const element = document.getElementById('cv-preview');
        html2pdf(element, {
            margin: [10, 10, 10, 10], // top, right, bottom, left
            filename: `${document.getElementById('name').value}_السيرة-الذاتية.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        });
    });
});
