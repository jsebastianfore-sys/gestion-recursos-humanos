from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Empleado
from .serializers import EmpleadoSerializer

# Create your views here.

class EmpleadoListView(generics.ListCreateAPIView):  # <--- Cambiado de EmpleadoListCreateView a EmpleadoListView
    """
    Vista para manejar la coleccion de empleados
    GET /api/empleados/  -> Lista todos los empleados
    POST /api/empleados/ -> Crea un empleado
    """
    queryset = Empleado.objects.all()
    serializer_class = EmpleadoSerializer

    def create(self, request, *args, **kwargs):
        """ Sobreescritura create() para devolver un mensaje 201"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {
                'mensaje': 'Empleado creado exitosamente',
                'empleado': serializer.data
            },
            status=status.HTTP_201_CREATED
        )

# <--- OJO: Esta clase va afuera, sin espacios al inicio
class EmpleadoDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Vista para manejar un empleado de manera individual
    GET /api/empleados/{id} -> Retorna un empleado por ID
    PUT /api/empleados/{id} -> Actualiza un nuevo empleado
    PATCH /api/empleados/{id} -> Actualizar campos de manera parcial
    DELETE /api/empleados/{id} -> Elimina un empleado
    """
    queryset = Empleado.objects.all()
    serializer_class = EmpleadoSerializer
    lookup_field = 'idEmpleado'

    def update(self, request, *args, **kwargs):
        """Sobreescribimos update() para manejar PUT y PATCH"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(
            {
                'mensaje': 'Empleado actualizado exitosamente',
                'empleado': serializer.data
            },
            status=status.HTTP_200_OK
        )

    def destroy(self, request, *args, **kwargs):
        """Sobreescribimos destroy() para manejar DELETE"""
        instance = self.get_object()
        nombre = instance.nombre
        self.perform_destroy(instance)
        return Response(
            {
                'mensaje': f'Empleado "{nombre}" Eliminado de manera exitosa'
            },
            status=status.HTTP_200_OK
        )