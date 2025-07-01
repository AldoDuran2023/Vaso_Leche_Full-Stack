from flask import Blueprint
from src.services.servicesDetalleIngresos import insert_detalle_ingreso, get_detallles, ingresar_inventario

detalle_ingreso = Blueprint('detalle_ingreso', __name__)

# Ruta para insertar un nuevo detalle de ingreso
@detalle_ingreso.route('/nuevo', methods=['POST'])
def insertar_detalle():
    return insert_detalle_ingreso()

# Ruta para obtener lista de los ingresos
@detalle_ingreso.route('/', methods=['GET'])
def obtener_detalles_lista():
    return get_detallles()

# Ruta para isnertar un ingreso de viver
@detalle_ingreso.route('/ingreso/nuevo', methods=['POST'])
def ingresar_viveres():
    return ingresar_inventario()

