from flask import jsonify, request
from src.database.db import mysql
import MySQLdb

# Funcion para obtener todos los representantes
def get_representantes():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM vista_representantes')
        result = cursor.fetchall()
        cursor.close()
        juntas_list = []
        for row in result:
            juntas_list.append({
                'id_representante': row[0],
                'estado': row[1],
                'nombres': row[2],
                'dni': row[3],
                'cargo': row[6],
                'junta': row[7]
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
        
# Funcion para insertar un nuevo representante de un procedure con mensaje de retorno
def insert_representante():
    try:
        data = request.get_json()

        fk_cargo = data['fk_cargo']
        fk_junta = data['fk_junta']
        fk_beneficiaria = data['fk_beneficiaria']

        cursor = mysql.connection.cursor()
        cursor.callproc('registrar_representante', (fk_cargo, fk_junta, fk_beneficiaria))
        mysql.connection.commit()

        return jsonify({
            'success': True,
            'message': "Representante Registrado Exitosamente"
        })

    except MySQLdb.Error as e:
        mysql.connection.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
