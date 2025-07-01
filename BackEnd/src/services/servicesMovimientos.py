from flask import jsonify, request
from src.database.db import mysql

# Funcion para obtener todos los movimientos de un representante
def get_movimientos():
    try:
        data = request.get_json()
        id_representante = data['id_representante']
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM vista_movimientos_detalle where id_representante = %s', (id_representante,))
        result = cursor.fetchall()
        cursor.close()
        juntas_list = []
        for row in result:
            juntas_list.append({
                'id_movimiento': row[0],
                'id_representante': row[1],
                'beneficiaria': row[6],
                'tipo': row[7],
                'fecha': row[2],
                'monto': row[3],
                'descripcion': row[4]
            })
        return jsonify({
            'success': True,
            'data': juntas_list,
            'message': 'Lista de Movimientos cargada correctamente'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        })
        
# funcion para insertar un nuevo movimiento
def insert_movimiento():
    try:
        data = request.get_json()

        fk_beneficiaria = data['fk_beneficiaria']
        fk_representante = data['fk_representante']
        fecha_pago = data['fecha_pago']

        cursor = mysql.connection.cursor()
        cursor.callproc('pagar_multas_por_beneficiaria', (fk_beneficiaria, fk_representante, fecha_pago))
        mysql.connection.commit()

        return jsonify({
            'success': True,
            'message': 'Pago de multas exitosas'
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        })
