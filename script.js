document.addEventListener('DOMContentLoaded', () => {
    const cvForm = document.getElementById('cv-form');
    const inputSection = document.getElementById('input-section');
    const previewSection = document.getElementById('preview-section');
    const cvPreview = document.getElementById('cv-preview');
    const addExperienceBtn = document.getElementById('add-experience');
    const addEducationBtn = document.getElementById('add-education');
    const downloadCvBtn = document.getElementById('download-cv');
    const experienceContainer = document.getElementById('experience-container');
    const educationContainer = document.getElementById('education-container');

    // وظيفة لإضافة حقل خبرة جديد
    function addExperienceField() {
        const div = document.createElement('div');
        div.classList.add('experience-item');
        div.innerHTML = `
            <label>المُسمّى الوظيفيّ:</label>
            <input type="text" class="job-title" placeholder="مدير مشروع">
            <label>الشركة:</label>
            <input type="text" class="company" placeholder="شركة التكنولوجيا">
            <label>فترة العمل:</label>
            <input type="text" class="work-period" placeholder="يناير 2020 - حتّى الآن">
            <label>المهام والمسؤوليّات:</label>
            <textarea class="responsibilities" placeholder="أدرت فريقًا من 10 أفراد..."></textarea>
            <hr>
        `;
        experienceContainer.appendChild(div);
    }

    // وظيفة لإضافة حقل تعليم جديد
    function addEducationField() {
        const div = document.createElement('div');
        div.classList.add('education-item');
        div.innerHTML = `
            <label>المؤهّل العلميّ:</label>
            <input type="text" class="degree" placeholder="بكالوريوس في علوم الحاسوب">
            <label>الجامعة/المؤسّسة:</label>
            <input type="text" class="university" placeholder="جامعة بيروت الأمريكيّة">
            <label>سنة التخرّج:</label>
            <input type="text" class="graduation-year" placeholder="2019">
            <hr>
        `;
        educationContainer.appendChild(div);
    }

    // إضافة حقل واحد تلقائيًّا عند التحميل
    addExperienceField();
    addEducationField();

    addExperienceBtn.addEventListener('click', addExperienceField);
    addEducationBtn.addEventListener('click', addEducationField);

    // وظيفة لإنشاء معاينة السيرة الذاتية
    cvForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

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

        // إنشاء هيكل HTML للسيرة الذاتية
        let htmlContent = `
            <div class="cv-header">
                <h2>${name}</h2>
                <p>البريد الإلكتروني: ${email}</p>
                <p>رقم الهاتف: ${phone}</p>
            </div>
            <h3>الخبرة العمليّة</h3>
            <ul class="experience-list">
                ${experiences.map(exp => `
                    <li>
                        <strong>${exp.jobTitle}</strong> في ${exp.company}
                        <br>
                        <span>${exp.period}</span>
                        <p>${exp.responsibilities}</p>
                    </li>
                `).join('')}
            </ul>
            <h3>المؤهّلات العلميّة</h3>
            <ul class="education-list">
                ${education.map(edu => `
                    <li>
                        <strong>${edu.degree}</strong> من ${edu.university} (${edu.year})
                    </li>
                `).join('')}
            </ul>
        `;

        cvPreview.innerHTML = htmlContent;
        inputSection.classList.add('hidden');
        previewSection.classList.remove('hidden');
    });

    // وظيفة تحميل السيرة الذاتيّة كملف PDF
    downloadCvBtn.addEventListener('click', () => {
        const element = document.getElementById('cv-preview');
        // هنا يجب استخدام مكتبة مثل jsPDF أو html2canvas
        // لتسهيل الأمر، يُمكنك إضافة هذا السطر في <head>
        // <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js"></script>

        html2pdf(element, {
            margin: 1,
            filename: 'السيرة الذاتية.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        });
    });
});
