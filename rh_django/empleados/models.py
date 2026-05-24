from django.db import models

# Create your models here.
class Empleado(models.Model):
    """
    Modelo que representa la tabla de 'empleados en la base de datos.
    Campos:
        - idEmpleado: clave primaria autoincremental
        - nombreEmpleado: nombre completo del empleado (obligatorio)
        - departamento: area a la que pertenecce el empleado (obligatorio)
        - sueldo: salario mensual con 2 decimales (debe ser positivo)

    """

    idEmpleado = models.AutoField(
        primary_key=True,
        verbose_name='ID Empleado',
    )

    nombre= models.CharField(
        max_length=150,
        null=False,
        blank=False,
        verbose_name='Nombre',
    )

    departamento = models.CharField(
        max_length=150,
        null=False,
        blank=False,
        verbose_name='Departamento',
    )

    sueldo = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=False,
        blank=False,
        verbose_name='Sueldo',
    )

    def __str__(self):
        return f'{self.nombre} - {self.departamento}'

    class Meta:
        db_table = 'empleado'
        verbose_name = 'Empleado'
        verbose_name_plural = 'Empleados'
        ordering = ['idEmpleado',]