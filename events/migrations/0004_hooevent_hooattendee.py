from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('events', '0003_event_creator'),
    ]

    operations = [
        migrations.CreateModel(
            name='HooEvent',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('location_name', models.CharField(help_text='Name of the spot', max_length=200)),
                ('address', models.CharField(help_text='Address of the spot', max_length=300)),
                ('lat', models.FloatField(help_text='Latitude')),
                ('lng', models.FloatField(help_text='Longitude')),
                ('description', models.TextField(help_text="What's the vibe? What are you planning?")),
                ('max_attendees', models.PositiveIntegerField(help_text='Max number of people')),
                ('contact_info', models.CharField(help_text='How can people reach you?', max_length=200)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('is_active', models.BooleanField(default=True)),
                ('host', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='hoo_events', to=settings.AUTH_USER_MODEL)),
            ],
            options={'ordering': ['-created_at']},
        ),
        migrations.CreateModel(
            name='HooAttendee',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('joined_at', models.DateTimeField(auto_now_add=True)),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attendees', to='events.hooevent')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={'unique_together': {('event', 'user')}},
        ),
    ]