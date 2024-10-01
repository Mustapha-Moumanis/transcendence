from rest_framework import permissions

class ProfilePermissions(permissions.BasePermission):
    """
    Custom permissions for user profile operations.
    """

    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS

    def has_object_permission(self, request, view, obj):
        return request.method in permissions.SAFE_METHODS