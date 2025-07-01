from flask import Blueprint
from src.services.servicesEntregas import get_entregas, insert_entrega, update_entrega

entregas = Blueprint('entregas', __name__)

# Ruta para obtener todas las entregas
@entregas.route('/', methods=['GET'])
def obetener_entregas():
    return get_entregas()

# Ruta para insertar nueva entrega
@entregas.route('/nuevo', methods=['POST'])
def nuevo():
    return insert_entrega()

# Ruta para actualizar una entrega
@entregas.route('/actualizar', methods=['PUT'])
def update():
    return update_entrega()
