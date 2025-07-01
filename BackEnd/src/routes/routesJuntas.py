from flask import Blueprint
from src.services.servicesJuntas import get_juntas, insert_junta

juntas = Blueprint('juntas', __name__)

# Ruta para obtener todas las juntas
@juntas.route('/', methods=['GET'])
def obtener_juntas():
    return get_juntas()

# Ruta para insertar una nueva junta
@juntas.route('/nuevo', methods=['POST'])
def registrar_junta(request):
    return insert_junta(request)