from src.database.db import mysql
from flask import jsonify, request
import MySQLdb

# Obtener todos los gastos de la vista
def obtener_gastos():
    fk_junta = request.args.get('id_representante')
    
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM vista_gastos_completa WHERE junta = %s', (fk_junta,))
    results = cursor.fetchall()
    cursor.close()
    
    gastos_list = []
    for row in results:
        gastos_list.append({
            'id_gasto': row[0],
            'nombres': row[1],
            'representante': row[2],
            'motivo': row[3],
            'fecha': row[4],
            'monto': row[5]
        })
    
    return jsonify({
        'success': True,
        'data': gastos_list,
        'message': 'Gastos obtenidos correctamente'
    })
    
# Insertar un nuevo gasto    
def insertar_gasto():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('insert into gastos(fk_representante, motivo_gasto, monto_gasto) values(%s, %s, %s)', (
            request.json['fk_representante'],
            request.json['motivo'],
            request.json['monto']
        ))
        mysql.connection.commit()
        return jsonify({
            'success': True,
            'message': 'Gasto registrado correctamente'
        })
    except MySQLdb.Error as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    finally:
        cursor.close()