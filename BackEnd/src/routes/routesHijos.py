from flask import Blueprint
from src.services.servicesHijos import insert_hijo, lista_de_hijos

hijos = Blueprint('hijos', __name__)

# ruta para registrar un hijo
@hijos.route('/nuevo', methods=['POST'])
def registrar_hijo():
    return insert_hijo()

# ruta para obtener todos los hijos de una beneficiaria
@hijos.route('/<int:id_beneficiaria>', methods=['GET'])
def obtener_hijos(id_beneficiaria):
    return lista_de_hijos(id_beneficiaria)