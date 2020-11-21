from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.exceptions import ImmediateHttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()


class MySocialAccount(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        user = sociallogin.user.email
        if user in settings.CONFIG.get("config", {}).get("email_login_allow_list", []):
            pass
        else:
            raise ImmediateHttpResponse(render(request, "error/page-403.html", {"email": user}))


class NoNewUsersAccountAdapter(DefaultAccountAdapter):
    def is_open_for_signup(self, request):
        """
        Checks whether or not the site is open for signups.

        Next to simply returning True/False you can also intervene the
        regular flow by raising an ImmediateHttpResponse

        (Comment reproduced from the overridden method.)
        """
        return True
