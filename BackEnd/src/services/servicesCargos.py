from flask import jsonify
from src.database.db import mysql

def get_cargos():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('select * from cargos')
        results = cursor.fetchall()
        cursor.close()
        cargos_list = []
        for row in results:
            cargos_list.append({
                'id_cargo': row[0],
                'cargo': row[1],
                'deberes': row[2]
            })
        return jsonify({
            'success': True,
            'data': cargos_list,
            'message': 'Cargos obtenidos correctamente'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error':str(e)
        })