# Generated by Django 4.2.16 on 2024-12-15 01:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Tournament',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('max_players', models.IntegerField(default=1)),
                ('n_players', models.IntegerField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('tournament', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='players', to='service_app.tournament')),
            ],
        ),
        migrations.CreateModel(
            name='Match',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('room_id', models.CharField(max_length=200)),
                ('time', models.TimeField(auto_now_add=True)),
                ('scores', models.CharField(max_length=200)),
                ('player1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player1', to='service_app.player')),
                ('player2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player2', to='service_app.player')),
                ('tournament', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='matches', to='service_app.tournament')),
                ('winner', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='winner', to='service_app.player')),
            ],
        ),
    ]
