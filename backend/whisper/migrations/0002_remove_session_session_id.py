# Generated by Django 4.0.6 on 2022-07-10 12:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('whisper', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='session',
            name='session_id',
        ),
    ]
