"""
Views for the one-page website.
index view displays the page and handles contact form submissions.
"""
from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import ContactForm


def index(request):
    """Render the one-page site and handle contact form post.

    On successful submit, a success message is shown using Django messages.
    """
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Thanks! Your message has been sent.')
            return redirect('index')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = ContactForm()

    # realistic-looking dummy testimonials used for demo
    dummy_reviews = [
        {
            'name': 'Aisha Khan',
            'initials': 'AK',
            'rating': 5,
            'stars': '★★★★★',
            'review': 'Bot Solutions rebuilt our e-commerce platform in under 10 weeks. The team was responsive, delivered on scope, and improved our checkout conversion by 28%. Highly recommend for complex web projects.',
            'time': '2 weeks ago',
        },
        {
            'name': 'Michael Brown',
            'initials': 'MB',
            'rating': 5,
            'stars': '★★★★★',
            'review': 'Excellent work on our mobile app. The UX improvements and performance tuning made a noticeable difference. Communication was clear and milestones were met on time.',
            'time': '1 month ago',
        },
        {
            'name': 'Sofia Patel',
            'initials': 'SP',
            'rating': 4,
            'stars': '★★★★☆',
            'review': 'Great AI prototype delivered quickly. Some minor polish was needed after launch, but overall the results exceeded our expectations and the team was a pleasure to work with.',
            'time': '3 months ago',
        },
        {
            'name': 'Daniel Kim',
            'initials': 'DK',
            'rating': 5,
            'stars': '★★★★★',
            'review': 'They helped us migrate to a cloud-native architecture with zero downtime. Knowledgeable engineers and practical recommendations — saved us time and money.',
            'time': '5 days ago',
        },
        {
            'name': 'Emma Wilson',
            'initials': 'EW',
            'rating': 5,
            'stars': '★★★★★',
            'review': 'Strong design sensibilities and attention to detail. The product shipped with a polished UI and accessible patterns throughout.',
            'time': '2 months ago',
        },
        {
            'name': 'Liam Smith',
            'initials': 'LS',
            'rating': 4,
            'stars': '★★★★☆',
            'review': 'Good delivery on our automation project. A few integrations required follow-up but the team supported us through the entire rollout.',
            'time': '4 weeks ago',
        },
        {
            'name': 'Olivia Johnson',
            'initials': 'OJ',
            'rating': 5,
            'stars': '★★★★★',
            'review': 'Professional, reliable, and skilled. They understood our business needs and translated them into an effective product strategy and implementation.',
            'time': 'Yesterday',
        },
        {
            'name': 'Noah Davis',
            'initials': 'ND',
            'rating': 5,
            'stars': '★★★★★',
            'review': 'Fast turnaround and excellent testing practices. Reduced our bug rate significantly after their QA pass.',
            'time': '6 days ago',
        },
        {
            'name': 'Maya Singh',
            'initials': 'MS',
            'rating': 4,
            'stars': '★★★★☆',
            'review': 'Impressive work on data pipelines and analytics. A couple of performance tweaks were applied post-launch, but the insights were valuable immediately.',
            'time': '3 weeks ago',
        },
        {
            'name': 'Ethan Clark',
            'initials': 'EC',
            'rating': 5,
            'stars': '★★★★★',
            'review': 'The chatbot integration helped us automate 40% of support queries. Well-architected and easy to extend.',
            'time': '2 days ago',
        },
        {
            'name': 'Isabella Garcia',
            'initials': 'IG',
            'rating': 5,
            'stars': '★★★★★',
            'review': 'Great cross-functional team. Project management was tight and deliveries were predictable — a rare find.',
            'time': '1 month ago',
        },
        {
            'name': 'Lucas Martinez',
            'initials': 'LM',
            'rating': 4,
            'stars': '★★★★☆',
            'review': 'Solid backend work and clear documentation. We onboarded new engineers faster thanks to their code structure.',
            'time': '6 months ago',
        },
    ]

    # compute a simple average rating for display
    total = sum(r['rating'] for r in dummy_reviews)
    avg = round(total / len(dummy_reviews), 1) if dummy_reviews else 0
    return render(request, 'index.html', {'form': form, 'dummy_reviews': dummy_reviews, 'avg_rating': avg, 'reviews_count': len(dummy_reviews)})
