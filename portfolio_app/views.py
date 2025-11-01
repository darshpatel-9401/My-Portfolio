from django.shortcuts import render, redirect
from django.http import HttpResponse, FileResponse
from django.contrib import messages
from .models import Project, Certificate, Resume, Contact

def prepare_project_data(projects):
    for project in projects:
        project.tech_list = [tech.strip() for tech in project.technologies.split(',')]
    return projects

def index(request):
    projects = Project.objects.all().order_by('-created_at')[:3]  # Show only 3 latest projects
    projects = prepare_project_data(projects)
    certificates = Certificate.objects.all()
    try:
        latest_resume = Resume.objects.latest()
    except Resume.DoesNotExist:
        latest_resume = None

    context = {
        'projects': projects,
        'certificates': certificates,
        'resume': latest_resume,
    }
    return render(request, 'index.html', context)

def projects(request):
    projects = Project.objects.all().order_by('-created_at')
    projects = prepare_project_data(projects)
    return render(request, 'projects.html', {'projects': projects})

def contact(request):
    if request.method == 'POST':
        try:
            contact = Contact.objects.create(
                name=request.POST['name'],
                email=request.POST['email'],
                subject=request.POST['subject'],
                message=request.POST['message']
            )
            messages.success(request, 'Your message has been sent successfully! I will get back to you soon.')
            return redirect('contact')
        except Exception as e:
            messages.error(request, 'There was an error sending your message. Please try again.')
            return redirect('contact')
    return render(request, 'contact.html')

def resume(request):
    try:
        latest_resume = Resume.objects.latest()
        if latest_resume.file:
            return FileResponse(latest_resume.file.open('rb'), as_attachment=True, filename="Darsh_Patel_Resume.pdf")
        else:
            return HttpResponse("Resume file not found", status=404)
    except Resume.DoesNotExist:
        return HttpResponse("Resume not found", status=404)
    except Exception as e:
        return HttpResponse(f"Error accessing resume: {str(e)}", status=500)
