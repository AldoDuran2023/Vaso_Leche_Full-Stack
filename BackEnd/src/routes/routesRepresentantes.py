from flask import Blueprint
from src.services.servicesRepresentantes import get_representantes, insert_representante

representantes = Blueprint('representantes', __name__)

# ruta para obtener a los represenatantes
@representantes.route('/', methods=['GET'])
def obtener_representantes():
    return get_representantes()

# ruta para isnertar un representante
@representantes.route('/nuevo', methods=['POST'])
def insertar_representante():
    return insert_representante()