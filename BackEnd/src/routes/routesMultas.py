from flask import Blueprint
from src.services.servicesMultas import get_multas, get_multas_no_pagadas

multas = Blueprint('multas', __name__)

@multas.route('/<int:id_beneficiaria>', methods=['GET'])
def obtener_multas_por_beneficiaria(id_beneficiaria):
    return get_multas(id_beneficiaria)


# ruta para obtener multas no pagadas
@multas.route('/', methods=['GET'])
def multas_no_pagadas():
    return get_multas_no_pagadas()