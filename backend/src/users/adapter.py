# from allauth.account.adapter import DefaultAccountAdapter
# from django.conf import settings

# class AccountAdapter(DefaultAccountAdapter):
#     def send_mail(self, template_prefix, email, context):
#         if 'key' in context:
#             context['activate_url'] = f"{settings.ACTIVATION_URL_BASE}{context['key']}"

#         super().send_mail(template_prefix, email, context)

from allauth.account.adapter import DefaultAccountAdapter
# from django.conf import settings
import random

class AccountAdapter(DefaultAccountAdapter):
    def generate_emailconfirmation_key(self, email):
        key = random.randint(100000, 999999)
        return str(key)

    def send_confirmation_mail(self, request, emailconfirmation, signup):
        ctx = {
            "user": emailconfirmation.email_address.user,
            "key": emailconfirmation.key,
        }
        if signup:
            email_template = "users/email_confirmation_signup"
        else:
            email_template = "users/email_confirmation"
        self.send_mail(email_template, emailconfirmation.email_address.email, ctx)
