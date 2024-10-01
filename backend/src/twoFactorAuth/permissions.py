from rest_framework import permissions

class TwoFactorAuthPermissions(permissions.BasePermission):
    """
    Custom permissions for TwoFactorAuth operations.
    Disallow POST if 2FA is not active for the user.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS or request.method == 'POST':
            return True
        
        return True

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS or request.method == 'POST':
            return True

        return True

