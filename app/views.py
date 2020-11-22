# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404, redirect
from django.template import loader
from django.http import HttpResponse
from django import template
from django.conf import settings
import json


@login_required(login_url="/login/")
def index(request):
    return render(
        request,
        "app-page/home.html",
        {
            """
            cameras --> used to populate template 
            alias_to_ip_map --> used to populate alias_to_ip_map
            access_tokens --> used to populate tokens
            """
            "cameras": settings.CONFIG.get("local", {}).get("network_info", []),
            "camera_ip": json.dumps(settings.CONFIG.get("local", {}).get("network_info", [])),
            "access_tokens": json.dumps(settings.CONFIG.get("tokens", {})),
        },
    )


@login_required(login_url="/login/")
def parameter_inspection(request):
    return render(
        request,
        "app-page/param_stats.html",
        {
            """
            alias_to_ip_map --> used to populate alias_to_ip_map
            access_tokens --> used to populate tokens
            """
            "camera_ip": json.dumps(settings.CONFIG.get("local", {}).get("network_info", [])),
            "access_tokens": json.dumps(settings.CONFIG.get("tokens", {})),
        },
    )


@login_required(login_url="/login/")
def pages(request):
    context = {}
    try:
        load_template = request.path.split("/")[-1]
        context["segment"] = load_template
        html_template = loader.get_template("template_examples/{}".format(load_template))
        return HttpResponse(html_template.render(context, request))
    except template.TemplateDoesNotExist:
        html_template = loader.get_template("error/page-404.html")
        return HttpResponse(html_template.render(context, request))
    except:
        html_template = loader.get_template("error/page-500.html")
        return HttpResponse(html_template.render(context, request))
