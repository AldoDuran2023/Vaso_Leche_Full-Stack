from flask import Blueprint
from src.services.servicesDetalleEntrega import get_detalle_entregas, update_detalle_entrega

detalles_entregas = Blueprint('detalle_entegas', __name__)

# Ruta para obtener todas los detalles de una entrega
@detalles_entregas.route('/<int:id_entrega>', methods=['GET'])
def obtener_detalle_entregas(id_entrega):
    return get_detalle_entregas(id_entrega)

# Ruta para actualizar el estado de un detalle de entrega
@detalles_entregas.route('/update', methods=['POST'])
def actualizar_detalle_entrega():
    return update_detalle_entrega()