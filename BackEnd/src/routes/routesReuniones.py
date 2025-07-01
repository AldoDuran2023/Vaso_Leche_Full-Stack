from flask import Blueprint
from src.services.servicesReuniones import get_reuniones, insert_reunion, update_reunion

reuniones = Blueprint('reuniones', __name__)

# ruta para obtener todas las reuniones
@reuniones.route('/', methods=['GET'])
def obtener_reuniones():
    return get_reuniones()

# ruta para insertar una nueva reunion
@reuniones.route('/nuevo', methods=['POST'])
def registrar_reunion():
    return insert_reunion()

# ruta para actualizar el estado de una reunion
@reuniones.route('/actualizar', methods=['PUT'])
def actualizar_reunion():
    return update_reunion()

