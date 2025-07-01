from flask import jsonify, request
from src.database.db import mysql
import MySQLdb

# Funcion para obtener todas las entregas de una junta
def get_entregas():
    try:
        fk_junta = request.args.get('id_representante')

        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM vista_entregas WHERE junta = %s', (fk_junta,))
        result = cursor.fetchall()
        cursor.close()

        entregas_list = []
        for row in result:
            entregas_list.append({
                'id_entrega': row[0],
                'representante': row[2],
                'fecha_entrega': row[3],
                'estado': row[4]
            })

        return jsonify({
            'success': True,
            'data': entregas_list,
            'message': 'Lista de Entregas cargadas correctamente'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

        
# funcion para insertar una nueva entrega
def insert_entrega():
    try:
        data = request.get_json()
        fk_representante = data['fk_representante']
        fecha_entrega = data['fecha_entrega']

        cursor = mysql.connection.cursor()

        cursor.callproc('crear_entrega_con_detalles', (fk_representante, fecha_entrega))
        mysql.connection.commit()

        return jsonify({
            'success': True,
            'message': 'Entrega registrada correctamente.'
        })

    except MySQLdb.Error as e:
        return jsonify({
            'success': False,
            'message': f'Error al registrar la entrega: {str(e)}'
        }), 500

    finally:
        cursor.close()

        
# Funcion para actualizar el estado de una entrega
def update_entrega():
    try:
        data = request.get_json()
        id_entrega = data['id_entrega']
        estado = data['estado']

        cursor = mysql.connection.cursor()
        cursor.execute('UPDATE entregas SET estado_entrega = %s WHERE id_entrega = %s', (estado, id_entrega))
        mysql.connection.commit()
        cursor.close()

        return jsonify({
            'success': True,
            'message': 'Entrega actualizada correctamente'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        })