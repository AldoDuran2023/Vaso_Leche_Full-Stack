from flask import jsonify
from src.database.db import mysql

# Funcion para obtener todas las juntas directivas
def get_juntas():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM juntas_directivas')
        result = cursor.fetchall()
        cursor.close()
        juntas_list = []
        for row in result:
            juntas_list.append({
                'id_junta': row[0],
                'nombre': row[1],
                'fecha_inicio': row[2],
                'fecha_fin': row[3],
                'estado': row[4]
            })
        return jsonify({
            'success': True,
            'data': juntas_list,
            'message': 'Juntas Diretivas cargados correctamente'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        })
        
# Funcion para insertar una nueva junta directiva
def insert_junta(request):
    try:
        data = request.get_json()
        nombre = data['nombre']
        fecha_inicio = data['fecha_inicio']
        fecha_fin = data['fecha_fin']
        
        cursor = mysql.connection.cursor()
        cursor.execute('INSERT INTO juntas_directivas (nombre, fecha_inicio, fecha_fin) VALUES (%s, %s, %s)', 
                       (nombre, fecha_inicio, fecha_fin))
        mysql.connection.commit()
        cursor.close()
        
        return jsonify({
            'success': True,
            'message': 'Junta Directiva insertada correctamente'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        })