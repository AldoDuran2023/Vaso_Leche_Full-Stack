from flask import Blueprint
from src.services.servicesInventarios import get_invnetario

inventarios = Blueprint('inventarios', __name__)

# Ruta para obtener los inventarios
@inventarios.route('/', methods=['GET'])
def obtener_inventarios():
    return get_invnetario()