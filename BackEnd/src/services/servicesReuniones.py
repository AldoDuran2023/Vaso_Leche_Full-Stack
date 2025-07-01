from flask import request, jsonify
from src.database.db import mysql
import MySQLdb

# Funcion para obtener todas las reuniones
def get_reuniones():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM vista_reuniones_detalle')
        result = cursor.fetchall()
        cursor.close()
        juntas_list = []
        for row in result:
            juntas_list.append({
                'id_reunion': row[0],
                'fecha_hora': row[1],
                'estado': row[2],
                'lugar': row[3],
                'motivo': row[4],
                'junta': row[5]
            })
        return jsonify({
            'success': True,
            'data': juntas_list,
            'message': 'Representantes cargados correctamente'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        })
        
# Funcion para insertar una nueva reunion
def insert_reunion():
    try:
        data = request.get_json()

        fk_junta = data['fk_junta']
        fecha_hora = data['fecha_hora']
        lugar = data['lugar']
        motivo = data['motivo']

        cursor = mysql.connection.cursor()
        cursor.callproc('registrar_reunion_con_asistencias', (fk_junta, fecha_hora, lugar, motivo))
        mysql.connection.commit()

        return jsonify({
            'success': True,
            'message': "Reunion registrada correctamente"
        })

    except MySQLdb.Error as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

    finally:
        cursor.close()
        
# Funcion para actualizar el estado de una reunion
def update_reunion():
    try:
        data = request.get_json()
        id_reunion = data['id_reunion']
        estado = data['estado']

        cursor = mysql.connection.cursor()
        cursor.execute("UPDATE reuniones SET estado_reunion = %s WHERE id_reunion = %s", (estado, id_reunion))
        mysql.connection.commit()
        cursor.close()

        return jsonify({
            'success': True,
            'message': 'Reunion actualizada correctamente'
        })

    except MySQLdb.Error as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500