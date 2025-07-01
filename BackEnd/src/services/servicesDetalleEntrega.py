from flask import jsonify, request
from src.database.db import mysql

# Funcion para obtener todos los detalles de entregas
def get_detalle_entregas(id_entrega):
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM vista_detalle_entregas_beneficiarias where id_entrega = %s', (id_entrega,))
        result = cursor.fetchall()
        cursor.close()
        juntas_list = []
        for row in result:
            juntas_list.append({
                'id_detalle': row[0],
                'id_beneficiaria': row[1],
                'beneficiaria': row[2],
                'cantidad_raciones': row[3],
                'estado': row[4],
                'detalles': row[5],
                'cantidad_multas_pendientes ': row[7]
            })
        return jsonify({
            'success': True,
            'data': juntas_list,
            'message': 'Lista de Entregas personales cargada correctamente'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        })
        
# funcion para actualizar el estado de una entrega con procedure
def update_detalle_entrega():
    try:
        data = request.get_json()

        id_detalle = data['id_detalle']
        estado = data['estado']

        cursor = mysql.connection.cursor()
        cursor.callproc('actualizar_detalle_entrega_y_stock', (id_detalle, estado))
        mysql.connection.commit()

        return jsonify({
            'success': True,
            'message': "Raciones Entregadas correctamente"
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        })
