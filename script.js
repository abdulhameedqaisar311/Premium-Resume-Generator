// -------------------
// Generate Resume (main function for PDF export)
// -------------------
function generateResume() {
    // Template selection
    const resumeTemplateDiv = document.getElementById("resumeTemplate");
    const selectedTemplate = document.getElementById("template").value;
    resumeTemplateDiv.classList.remove("template1","template2","template3");
    resumeTemplateDiv.classList.add(selectedTemplate);

    // Trigger all sections update (in case user didn't type anything yet)
    updateAllSections();
}

// -------------------
// Update Sections Helpers
// -------------------

// Line-separated sections
function updateSection(inputId,outputId){
    const container = document.getElementById(outputId);
    container.innerHTML="";
    const lines = document.getElementById(inputId).value.split("\n");
    lines.forEach(l=>{
        if(l.trim()!==""){
            const p = document.createElement("p");
            p.innerText = l.trim();
            container.appendChild(p);
        }
    });
}

// Comma-separated sections
function updateCommaSection(inputId,outputId){
    const container = document.getElementById(outputId);
    container.innerHTML="";
    const items = document.getElementById(inputId).value.split(",");
    items.forEach(i=>{
        if(i.trim()!==""){
            const p = document.createElement("p");
            p.innerText = i.trim();
            container.appendChild(p);
        }
    });
}

// Update all sections (used for initial PDF generation)
function updateAllSections(){
    // Basic info
    document.getElementById("rName").innerText = document.getElementById("name").value;
    document.getElementById("rEmail").innerText = document.getElementById("email").value;
    document.getElementById("rPhone").innerText = document.getElementById("phone").value;
    document.getElementById("rLinkedin").innerText = document.getElementById("linkedin").value;

    // Profile photo
    const fileInput = document.getElementById("photoUpload");
    const file = fileInput.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = function(e){
            document.getElementById("rPhoto").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Update sections
    ["education","experience","certifications","awards"].forEach(id=>{
        updateSection(id,"r"+capitalizeFirstLetter(id));
    });
    ["projects","hobbies"].forEach(id=>{
        updateCommaSection(id,"r"+capitalizeFirstLetter(id));
    });

    // Languages
    const container = document.getElementById("rLanguages");
    container.innerHTML="";
    const langs = document.getElementById("languages").value.split(",");
    langs.forEach(l=>{
        const [lang,level] = l.split(":");
        if(lang && level){
            const p = document.createElement("p");
            p.innerText = `${lang.trim()} - ${level.trim()}`;
            container.appendChild(p);
        }
    });

    // Skills
    updateSkills();
}

// Update skills with animation
function updateSkills(){
    const container = document.getElementById("rSkills");
    container.innerHTML = "";
    const skills = document.getElementById("skills").value.split(",");
    skills.forEach(s => {
        const skillName = s.trim();
        if(skillName !== ""){
            const span = document.createElement("span");
            span.classList.add("skill-pill");
            span.innerText = skillName;
            container.appendChild(span);
        }
    });
}

// -------------------
// Live Preview (Step 3)
// -------------------

// Text input live preview
["name","email","phone","linkedin"].forEach(id=>{
    document.getElementById(id).addEventListener("input", e=>{
        document.getElementById("r"+capitalizeFirstLetter(id)).innerText = e.target.value;
    });
});

// Line-separated sections live preview
["education","experience","certifications","awards"].forEach(id=>{
    document.getElementById(id).addEventListener("input", e=>{
        updateSection(id,"r"+capitalizeFirstLetter(id));
    });
});

// Comma-separated sections live preview
["projects","hobbies"].forEach(id=>{
    document.getElementById(id).addEventListener("input", e=>{
        updateCommaSection(id,"r"+capitalizeFirstLetter(id));
    });
});

// Languages live preview
document.getElementById("languages").addEventListener("input", e=>{
    const container = document.getElementById("rLanguages");
    container.innerHTML="";
    const langs = e.target.value.split(",");
    langs.forEach(l=>{
        const [lang,level] = l.split(":");
        if(lang && level){
            const p = document.createElement("p");
            p.innerText = `${lang.trim()} - ${level.trim()}`;
            container.appendChild(p);
        }
    });
});

// Skills live preview
document.getElementById("skills").addEventListener("input", e=>{
    updateSkills();
});

// Profile photo live preview
document.getElementById("photoUpload").addEventListener("change", e=>{
    const file = e.target.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = function(ev){
            document.getElementById("rPhoto").src = ev.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Template selection live preview
document.getElementById("template").addEventListener("change", e=>{
    const resumeTemplateDiv = document.getElementById("resumeTemplate");
    resumeTemplateDiv.classList.remove("template1","template2","template3");
    resumeTemplateDiv.classList.add(e.target.value);
});

// -------------------
// Download PDF
// -------------------
function downloadPDF(){
    const resume = document.getElementById("resumeTemplate");
    const downloadBtn = resume.querySelector(".no-print");
    downloadBtn.style.display="none";

    html2canvas(resume,{scale:2}).then(canvas=>{
        const imgData = canvas.toDataURL("image/png");
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("p","mm","a4");
        const pdfWidth = 210;
        const pdfHeight = (canvas.height*pdfWidth)/canvas.width;
        pdf.addImage(imgData,"PNG",0,0,pdfWidth,pdfHeight);
        pdf.save("resume.pdf");
        downloadBtn.style.display="block";
    });
}

// -------------------
// Helper Function
// -------------------
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}