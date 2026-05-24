from rest_framework import serializers
from .models import Empleado

class EmpleadoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Empleado
        fields = ['idEmpleado', 'nombre', 'departamento', 'sueldo']
        read_only_fields = ['idEmpleado']

    def validate_nombre(self, value):
        """El nombre no puede ser una cadena vacia o solo espacios"""
        value = value.strip()
        if not value:
            raise serializers.ValidationError(
                'El nombre no puede estar vacio ni contener solo espacios'

            )
        if len(value) < 2:
            raise serializers.ValidationError(
                'El nombre debe tener almenos 2 caracteres'
            )
        return value

    def validate_departamento(self, value):
        """El departamento no puede ser una cadena vacia o solo espacios"""
        value = value.strip()
        if not value:
            raise serializers.ValidationError(
                'El departamento no puede estar vacio ni contener solo espacios'
            )
        return value

    def validate_sueldo(self, value):
        """El sueldo debe ser un numero positivo mayor que cero"""
        if value <= 0:
            raise serializers.ValidationError(
                'El sueldo debe ser un numero mayor que cero'
            )
        return value
