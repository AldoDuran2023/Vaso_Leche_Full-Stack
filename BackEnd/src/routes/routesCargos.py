from flask import Blueprint
from src.services.servicesCargos import get_cargos

cargos = Blueprint('cargos', __name__)

# Ruta para obtener todos los cargos
@cargos.route('/', methods=['GET'])
def obetener_cargos():
    return get_cargos()