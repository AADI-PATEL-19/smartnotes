from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.translation import gettext_lazy as _

# Custom User Manager
class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        if not email:
            raise ValueError(_('Users must have an email address'))
        if not username:
            raise ValueError(_('Users must have a username'))

        email = self.normalize_email(email)
        user = self.model(username=username, email=email)
        user.set_password(password)  # This hashes the password
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None):
        user = self.create_user(username, email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

# Custom User model
class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=128)  # Explicit password field

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Many-to-many relationship with Folder
    folders = models.ManyToManyField('Folder', blank=True, related_name='users')

    # Avoid clashes with the default auth system's groups and permissions
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='playground_users',  # Custom related name to avoid conflicts
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='playground_user_permissions',  # Custom related name to avoid conflicts
        blank=True
    )

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']


    objects = CustomUserManager()

    def __str__(self):
        return self.email

    # Folder management methods
    def add_folder(self, folder):
        self.folders.add(folder)

    def remove_folder(self, folder):
        self.folders.remove(folder)

    def update_folder(self, old_folder, new_folder_name):
        if old_folder in self.folders.all():
            old_folder.name = new_folder_name
            old_folder.save()

# Folder model
class Folder(models.Model):
    name = models.CharField(max_length=255, unique=True)
    files = models.ManyToManyField('File', blank=True, related_name='folders')

    def __str__(self):
        return self.name

    # File management methods
    def add_file(self, file):
        self.files.add(file)

    def remove_file(self, file):
        self.files.remove(file)

    def update_file(self, old_file, new_file_name, new_content):
        if old_file in self.files.all():
            old_file.name = new_file_name
            old_file.content = new_content
            old_file.save()

# File model
class File(models.Model):
    name = models.CharField(max_length=255, unique=True)
    content = models.TextField()

    def __str__(self):
        return self.name
