from flask import Blueprint, request
from src.services.servicesBeneficiaria import get_beneficiarias, registrar_beneficiaria, actualizar_beneficiaria, reporte_beneficiarias, get_beneficiaria_por_id, cambiar_estado_beneficiaria

beneficiarias = Blueprint('beneficiarias', __name__)

# ruta para obetner la lista de beneficiarias
@beneficiarias.route('/', methods=['GET'])
def lista_beneficiarias():
    return get_beneficiarias()

# ruta para obtener una beneficiaria en especifico
@beneficiarias.route('/<int:id_beneficiaria>', methods=['GET'])
def obtener_beneficiaria(id_beneficiaria):
    return get_beneficiaria_por_id(id_beneficiaria)

#ruta para registrar una beneficiaria
@beneficiarias.route('/registrar', methods=['POST'])
def nueva_beneficiaria():
    return registrar_beneficiaria()

# Ruta para actualizar una beneficiaria
@beneficiarias.route('/actualizar', methods=['PUT'])
def actualizar_datos():
    return actualizar_beneficiaria(request)

# Ruta para los reportes
@beneficiarias.route('/reporte/beneficiarias', methods=['GET'])
def reporte_pdf():
    return reporte_beneficiarias()

# Ruta para cambiar el estado de una beneficiaria
@beneficiarias.route('/cambiar-estado/<int:id_beneficiaria>', methods=['PUT'])
def cambiar_estado(id_beneficiaria):
    return cambiar_estado_beneficiaria(id_beneficiaria)
