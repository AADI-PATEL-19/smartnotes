from rest_framework import serializers
from .models import User, Folder, File

# File Serializer
class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'name', 'content']

# Folder Serializer with writable nested FileSerializer
class FolderSerializer(serializers.ModelSerializer):
    files = FileSerializer(many=True, required=False)  # Writable nested serializer for related files

    class Meta:
        model = Folder
        fields = ['id', 'name', 'files']

    def create(self, validated_data):
        files_data = validated_data.pop('files', [])  # Extract files data
        folder = Folder.objects.create(**validated_data)
        for file_data in files_data:
            File.objects.create(folder=folder, **file_data)
        return folder

    def update(self, instance, validated_data):
        files_data = validated_data.pop('files', [])
        instance.name = validated_data.get('name', instance.name)
        instance.save()

        # Optionally, update or create files associated with the folder
        for file_data in files_data:
            file_instance, created = File.objects.update_or_create(
                folder=instance, name=file_data.get('name'),
                defaults={'content': file_data.get('content')}
            )
        return instance

# User Serializer with writable nested FolderSerializer
class UserSerializer(serializers.ModelSerializer):
    folders = FolderSerializer(many=True, required=False)  # Writable nested serializer for related folders

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'folders']

    def create(self, validated_data):
        folders_data = validated_data.pop('folders', [])
        user = User.objects.create(**validated_data)

        # Create folders and associated files
        for folder_data in folders_data:
            files_data = folder_data.pop('files', [])
            folder = Folder.objects.create(user=user, **folder_data)
            for file_data in files_data:
                File.objects.create(folder=folder, **file_data)
        return user

    def update(self, instance, validated_data):
        folders_data = validated_data.pop('folders', [])
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        # Optionally, update or create folders associated with the user
        for folder_data in folders_data:
            folder_instance, created = Folder.objects.update_or_create(
                user=instance, name=folder_data.get('name'),
                defaults={'files': folder_data.get('files', [])}
            )
        return instance
