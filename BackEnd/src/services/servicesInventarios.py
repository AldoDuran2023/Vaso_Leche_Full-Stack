from flask import jsonify
from src.database.db import mysql

def get_invnetario():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM viveres')
        result = cursor.fetchall()
        cursor.close()
        inventario_list = []
        for row in result:
            inventario_list.append({
                'id_viver': row[0],
                'nombre_viver': row[1],
                'tipo_unidad': row[2],
                'descripcion': row[3],
                'cantidad': row[4]
            })
        return jsonify({
            'success': True,
            'data': inventario_list,
            'message': 'Viveres cargados correctamente'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        })