from flask import jsonify, request
from src.database.db import mysql

# Funcion para insertar un ingreso
def ingresar_inventario():
    try:
        data = request.get_json()

        fecha_ingreso = data['fecha_ingreso']
        responsable = data['responsable']
        fk_junta_directiva = data['fk_junta_directiva']
        
        cursor = mysql.connection.cursor()
        cursor.execute(
            'INSERT INTO ingresos_viveres (fecha_ingreso, responsable, fk_junta_directiva) VALUES (%s, %s, %s)',
            (fecha_ingreso, responsable, fk_junta_directiva)
        )
        id_ingreso = cursor.lastrowid  # ✅ Capturamos el ID recién generado
        mysql.connection.commit()
        
        return jsonify({
            'success': True,
            'message': 'Ingreso registrado exitosamente',
            'id_ingreso': id_ingreso  # ✅ Lo enviamos al frontend
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        })


# Funcion para insertar un nuevo detalle de ingreso
def insert_detalle_ingreso():
    try:
        data = request.get_json()

        fk_ingreso = data['fk_ingreso']
        fk_viver = data['fk_viver']
        cantidad = data['cantidad']

        cursor = mysql.connection.cursor()
        cursor.callproc('agregar_detalle_ingreso_viver', (fk_ingreso, fk_viver, cantidad))
        mysql.connection.commit()

        return jsonify({
            'success': True,
            'message': 'Detalles registrados exitosamente'
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        })
        
# Funcion para obtener todos los detalles de ingreso
def get_detallles():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM vista_ingresos_viveres')
        result = cursor.fetchall()
        cursor.close()
        detalles_list = []
        for row in result:
            detalles_list.append({
                'id_detalle': row[0],
                'fecha': row[1],
                'responsable': row[2],
                'junta': row[3],
                'detalles': row[4]
            })
        return jsonify({
            'success': True,
            'data': detalles_list,
            'message': 'Registro de detalles cargados correctamente'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        })