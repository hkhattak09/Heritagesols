// Careers Page JavaScript

// EmailJS Configuration
// INSERT HERE: Replace with your EmailJS configuration
const EMAILJS_CONFIG = {
   serviceID: 'Insert',
   templateID: 'Insert',
   publicKey: 'Insert'
};

// Google Sheets Configuration
// INSERT HERE: Replace with your Google Apps Script Web App URL
const GOOGLE_SHEETS_URL = 'Insert';

// Google Drive Configuration
// INSERT HERE: Replace with your Google Drive folder ID for resume storage
const GOOGLE_DRIVE_FOLDER_ID = 'Insert';

// Initialize EmailJS
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your public key
    emailjs.init(EMAILJS_CONFIG.publicKey);
    
    // Set fixed background
    const fixedBackground = document.getElementById('fixedBackground');
    if (fixedBackground) {
        fixedBackground.style.opacity = '0.8';
    }
    
    // Mobile menu functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Global variables
let currentJobTitle = '';
const modal = document.getElementById('applicationModal');

// Modal Functions
function openApplicationModal(jobTitle) {
    currentJobTitle = jobTitle;
    document.getElementById('modalJobTitle').textContent = jobTitle;
    
    // Reset form and show initial state
    showApplicationForm();
    
    // Show modal
    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Focus on first input
    setTimeout(() => {
        document.getElementById('applicantName').focus();
    }, 300);
}

function closeApplicationModal() {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetForm();
    }, 300);
}

function showApplicationForm() {
    document.getElementById('applicationForm').style.display = 'block';
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('successState').style.display = 'none';
    document.getElementById('errorState').style.display = 'none';
}

function showLoadingState() {
    document.getElementById('applicationForm').style.display = 'none';
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('successState').style.display = 'none';
    document.getElementById('errorState').style.display = 'none';
}

function showSuccessState() {
    document.getElementById('applicationForm').style.display = 'none';
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('successState').style.display = 'block';
    document.getElementById('errorState').style.display = 'none';
}

function showErrorState(message = 'There was an error submitting your application. Please try again.') {
    document.getElementById('applicationForm').style.display = 'none';
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('successState').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
    document.getElementById('errorMessage').textContent = message;
}

function resetForm() {
    document.getElementById('applicationForm').reset();
    showApplicationForm();
}

// File handling functions
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function validateFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
    }
    
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Only PDF, DOC, and DOCX files are allowed');
    }
    
    return true;
}

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('applicationForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            showLoadingState();
            
            // Get form data
            const formData = new FormData(form);
            const resumeFile = formData.get('resume');
            
            // Validate resume file
            if (resumeFile && resumeFile.size > 0) {
                validateFile(resumeFile);
            } else {
                throw new Error('Please upload your resume');
            }
            
            // Convert file to base64
            const resumeBase64 = await fileToBase64(resumeFile);
            
            // Prepare application data
            const applicationData = {
                jobTitle: currentJobTitle,
                timestamp: new Date().toISOString(),
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                employmentStatus: formData.get('employmentStatus'),
                workExperience: formData.get('workExperience'),
                comments: formData.get('comments') || 'No comments provided',
                resumeFileName: resumeFile.name,
                resumeBase64: resumeBase64
            };
            
            // Submit to both email and Google Sheets
            await Promise.all([
                sendEmailNotification(applicationData),
                saveToGoogleSheets(applicationData)
            ]);
            
            showSuccessState();
            
        } catch (error) {
            console.error('Submission error:', error);
            showErrorState(error.message);
        }
    });
});

// Email notification using EmailJS
async function sendEmailNotification(data) {
    const emailParams = {
        job_title: data.jobTitle,
        applicant_name: data.name,
        applicant_email: data.email,
        applicant_phone: data.phone,
        applicant_address: data.address,
        applicant_city: data.city,
        employment_status: data.employmentStatus,
        work_experience: data.workExperience,
        comments: data.comments,
        resume_filename: data.resumeFileName,
        submission_date: new Date(data.timestamp).toLocaleString(),
        // Note: EmailJS has limitations with file attachments
        // The resume will be stored in Google Drive and link will be provided
        message: `New job application received for ${data.jobTitle} position.
        
Applicant Details:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone}
- Address: ${data.address}
- City: ${data.city}
- Employment Status: ${data.employmentStatus}
- Work Experience: ${data.workExperience}
- Comments: ${data.comments}

The resume has been uploaded to Google Drive. Please check the Google Sheets for the complete application details and resume link.`
    };
    
    try {
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.templateID,
            emailParams
        );
        console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new Error('Failed to send email notification');
    }
}

// Save to Google Sheets using Google Apps Script
async function saveToGoogleSheets(data) {
    const payload = {
        timestamp: data.timestamp,
        jobTitle: data.jobTitle,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        employmentStatus: data.employmentStatus,
        workExperience: data.workExperience,
        comments: data.comments,
        resumeFileName: data.resumeFileName,
        resumeBase64: data.resumeBase64,
        driveFolder: GOOGLE_DRIVE_FOLDER_ID
    };
    
    try {
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Data saved to Google Sheets:', result);
        return result;
    } catch (error) {
        console.error('Google Sheets save failed:', error);
        throw new Error('Failed to save application data');
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeApplicationModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeApplicationModal();
    }
});

// Form validation enhancements
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
});

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#dc3545';
    field.style.background = 'rgba(220, 53, 69, 0.05)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    field.style.background = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Add loading states to buttons
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.innerHTML = '<div style="display: inline-block; width: 16px; height: 16px; border: 2px solid transparent; border-left: 2px solid currentColor; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 8px;"></div>Submitting...';
    } else {
        button.disabled = false;
        button.textContent = button.dataset.originalText || 'Submit Application';
    }
}