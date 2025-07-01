from flask import Blueprint
from src.services.servicesMovimientos import get_movimientos, insert_movimiento

movimientos = Blueprint('movimientos', __name__)

# ruta para obteener todos los movimientos
@movimientos.route('/', methods=['GET'])
def obtener_movimientos():
    return get_movimientos()

# ruta para insertar un movimeinto
@movimientos.route('/nuevo', methods=['POST'])
def insertar_movimiento():
    return insert_movimiento()
