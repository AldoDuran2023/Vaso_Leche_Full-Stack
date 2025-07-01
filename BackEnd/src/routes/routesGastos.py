from flask import Blueprint, request
from src.services.servicesGastos import obtener_gastos, insertar_gasto

gastos = Blueprint('gastos', __name__)

# Ruta para obtener todos los gastos
@gastos.route('/', methods=['GET'])
def lista_gastos():
    return obtener_gastos()

#Ruta para registrar un gasto
@gastos.route('/nuevo', methods=['POST'])
def registrar_gasto():
    return insertar_gasto()