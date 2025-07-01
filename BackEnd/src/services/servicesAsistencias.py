from flask import jsonify, request
from src.database.db import mysql
import MySQLdb

# Funcion para obtner todas las asistencias de un reunion
def get_asistencias(id_reunion):
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM vista_asistencias_detalle where id_reunion = %s', (id_reunion,))
        result = cursor.fetchall()
        cursor.close()
        juntas_list = []
        for row in result:
            juntas_list.append({
                'id_asistencia': row[0],
                'id_beneficiaria': row[1],
                'beneficiaria': row[3],
                'estado': row[4]
            })
        return jsonify({
            'success': True,
            'data': juntas_list,
            'message': 'Lista de Asistencia cargada correctamente'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        })
        
# funcion para actualizar el estado de una asistencia
def update_asistencia():
    try:
        data = request.get_json()
        print("Datos recibidos en update_asistencia:", data)

        id_asistencia = data['id_asistencia']
        estado = data['estado']

        cursor = mysql.connection.cursor()
        cursor.callproc('actualizar_asistencia_generar_multa', (id_asistencia, estado))
        mysql.connection.commit()

        return jsonify({
            'success': True,
            'message': "Asistencia actualizada"
        })

    except MySQLdb.Error as e:
        print("ERROR MySQL:", str(e))  # <--- Agregado
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

    finally:
        cursor.close()