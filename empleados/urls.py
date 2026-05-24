from django.urls import path
from . import views

app_name = 'empleados'

urlpatterns = [
    path(
        '',
        views.EmpleadoListView.as_view(),
        name='empleado-list-create'
    ),

    path(
        '<int:idEmpleado>/',
        views.EmpleadoDetailView.as_view(),
        name='empleado-detail'
    ),
]