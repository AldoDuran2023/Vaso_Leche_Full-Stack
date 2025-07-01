from flask import jsonify, request
from src.database.db import mysql

# funcion para obtner todas las multas por beneficiaria
def get_multas(id_beneficiaria):
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM vista_multas_detalle WHERE id_beneficiaria = %s', (id_beneficiaria,))
        result = cursor.fetchall()
        cursor.close()
        multas_list = []
        for row in result:
            multas_list.append({
                'id_multa': row[0],
                'id_beneficiaria': row[1],
                'beneficiaria': row[3],
                'tipo': row[4],
                'monto': row[5],
                'descripcion': row[6],
                'estado': row[7]
            })
        return jsonify({
            'success': True,
            'data': multas_list,
            'message': 'Multas cargadas correctamente'
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

# funion para obtener todas las multas no pagadas
def get_multas_no_pagadas():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM vista_multas_detalle')
        result = cursor.fetchall()
        cursor.close()
        juntas_list = []
        for row in result:
            juntas_list.append({
                'id_multa': row[0],
                'id_beneficiaria': row[1],
                'beneficiaria': row[3],
                'tipo': row[4],
                'monto': row[5],
                'descripcion': row[6],
                'estado': row[7]
            })
        return jsonify({
            'success': True,
            'data': juntas_list,
            'message': 'Lista de Multas por beneficiaria cargada correctamente'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        })
