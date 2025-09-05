from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.conf import settings
from django.contrib import messages

# main view
def portfolio(request):
    return render(request, "index.html")

# send email logic
def contact(request):
    # fetch data from the form
    if request.method == 'POST':
        email = request.POST.get('email', '')
        subject = request.POST.get('subject', '')
        message = request.POST.get('message', '')

        # Send email
        send_mail(
            email + " wrote " + subject,
            message,
            email,  
            [settings.EMAIL_HOST_USER],  # recipient
            fail_silently=False,  
        )
        messages.success(request, 'Thank you for your message, I will reach you back as soon as possible :)')

        # Redirect to index page
        return redirect(portfolio)
    messages.warning(request, 'Message not sent!')
    return render(request, 'index.html')