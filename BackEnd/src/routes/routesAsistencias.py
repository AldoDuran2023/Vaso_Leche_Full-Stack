from flask import Blueprint
from src.services.servicesAsistencias import get_asistencias, update_asistencia

asistencias = Blueprint('asistencias', __name__)

# Ruta para obtener todas las asistencias de una reunion
@asistencias.route('/<int:id_reunion>', methods=['GET'])
def obtener_asistencias(id_reunion):
    return get_asistencias(id_reunion)

# Ruta para actualizar el estado de una asitencia
@asistencias.route('/update', methods=['PUT'])
def actualizar_asistencia():
    return update_asistencia() 
