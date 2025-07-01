from flask import jsonify, request
from src.database.db import mysql
import MySQLdb

# Funcion para registrar a un nuevo hijo
def insert_hijo():
    try:
        data = request.get_json()

        dni = data['dni']
        nombres = data['nombres']
        ap_paterno = data['ap_paterno']
        ap_materno = data['ap_materno']
        direccion = data['direccion']
        fecha_nacimiento = data['fecha_nacimiento']
        partida = data['partida']
        dni_madre = data['dni_madre']

        cursor = mysql.connection.cursor()
        cursor.callproc('registrar_hijo', (
            dni, nombres, ap_paterno, ap_materno,
            direccion, fecha_nacimiento, partida, dni_madre
        ))

        while cursor.nextset():
            pass

        mysql.connection.commit()

        return jsonify({
            'success': True,
            'message': "Registro exitoso del hijo"
        })

    except MySQLdb.Error as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

    finally:
        cursor.close()
        
# funcion para devolver a los hijos de una beneficiaria
def lista_de_hijos (id):
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM vista_hijos where fk_beneficiaria = %s',(id,))
        result = cursor.fetchall()
        cursor.close()
        hijos_list = []
        for row in result:
            hijos_list.append({
                'id_hijo': row[2],
                'DNI': row[3],
                'nombres': row[4],
                'edad': row[5],
                'partida': row[6],
                'direccion': row[7],
                'estado': row[8]
            })
        return jsonify({
            'success': True,
            'data': hijos_list,
            'message': 'Hijos cargados correctamente'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        })