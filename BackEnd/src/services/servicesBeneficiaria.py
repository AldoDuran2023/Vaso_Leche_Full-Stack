from src.database.db import mysql
from flask import jsonify, send_file, request
from src.Reports.rpt_beneficiarias import obtener_datos, ReporteProfesionalPDF
import io
from datetime import datetime
import MySQLdb

# Retornar la lista de las beneficiarias
def get_beneficiarias():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM vista_beneficiarias")
    results = cursor.fetchall()
    cursor.close()

    beneficiarias_list = []
    for row in results:
        beneficiarias_list.append({
            'id_persona': row[0],
            'id_beneficiaria': row[1],
            'dni': row[2],
            'nombres_completos': row[3],
            'nombre': row[4],
            'ap_paterno': row[5],
            'ap_materno': row[6],
            'direccion': row[7],
            'hijos': row[8],
            'telefono': row[9],
            'sisfoh': row[10],
            'tipo': row[11],
            'raciones': row[12],
            'estado': row[15]
        })

    return jsonify({
            'success': True,
            'data': beneficiarias_list,
            'message': 'Beneficiarias obtenidos correctamente'
        }), 200
    
# Obtener una beneficiaria por su id
def get_beneficiaria_por_id(id_beneficiaria):
    try:
        cursor = mysql.connection.cursor()
        query = "SELECT * FROM vista_beneficiarias WHERE id_beneficiaria = %s"
        cursor.execute(query, (id_beneficiaria,))
        row = cursor.fetchone()
        cursor.close()

        if row is None:
            return jsonify({
                'success': False,
                'message': 'Beneficiaria no encontrada'
            }), 404

        beneficiaria = {
            'id_persona': row[0],
            'id_beneficiaria': row[1],
            'dni': row[2],
            'nombres_completos': row[3],
            'nombre': row[4],
            'ap_paterno': row[5],
            'ap_materno': row[6],
            'direccion': row[7],
            'hijos': row[8],
            'telefono': row[9],
            'sisfoh': row[10],
            'tipo': row[11],
            'raciones': row[12],
            'estado': row[15],
            'fecha_nacimiento': row[13]
        }

        return jsonify({
            'success': True,
            'data': beneficiaria,
            'message': 'Beneficiaria obtenida correctamente'
        }), 200

    except MySQLdb.Error as e:
        mysql.connection.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500
        
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()

    
# Registrar una nueva beneficiaria
def registrar_beneficiaria():
    try:
        
        cursor = mysql.connection.cursor()
        cursor.execute('call InsertarBeneficiaria(%s, %s, %s, %s, %s, %s, %s, %s, %s)', (
            request.json['dni'],
            request.json['nombres'],
            request.json['apellido_paterno'],
            request.json['apellido_materno'],
            request.json['direccion'],
            request.json['fecha_nacimiento'],
            request.json['fk_tipo_beneficiaria'],
            request.json['telefono'],  
            request.json['sisfoh']  
        ))
        mysql.connection.commit()
        return jsonify({
            'success': True,
            'message': 'Beneficiaria registrada correctamente'
        })
    except MySQLdb.Error as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400
    finally:
        cursor.close()

# Actualizar una beneficiaria
def actualizar_beneficiaria(request):
    try:
        data = request.get_json()
        print("Datos recibidos:", data)
        cursor = mysql.connection.cursor()

        # Verifica que todos los campos estén presentes
        campos_requeridos = [
            'id_beneficiaria', 'dni', 'nombres', 'apellido_paterno', 'apellido_materno',
            'direccion', 'fecha_nacimiento', 'fk_tipo_beneficiaria', 'telefono', 'sisfoh'
        ]
        for campo in campos_requeridos:
            if campo not in data:
                return jsonify({'success': False, 'error': f'Falta el campo: {campo}'}), 400

        # Ejecutar procedimiento con parámetro OUT
        cursor.execute('CALL actualizar_beneficiaria(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)', (
            data['id_beneficiaria'],
            data['dni'],
            data['nombres'],
            data['apellido_paterno'],
            data['apellido_materno'],
            data['direccion'],
            data['fecha_nacimiento'],
            data['fk_tipo_beneficiaria'],
            data['sisfoh'],
            data['telefono']
        ));

        # Obtener mensaje del procedimiento
        mysql.connection.commit()
        return jsonify({
            'success': True,
            'message': "Datos actualizados exitosamente"
        }), 200

    except MySQLdb.Error as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    finally:
        cursor.close()

# Realizar Reporte pdf
def reporte_beneficiarias():
    """Función para generar y descargar el reporte PDF desde Flask"""    
    try:
        # Obtener datos
        datos = obtener_datos()
        
        if not datos:
            return jsonify({"error": "No se encontraron datos"}), 404
        
        # Generar PDF profesional
        pdf = ReporteProfesionalPDF()
        pdf.generar_reporte_completo(datos)
        
        # Generar PDF como bytes
        pdf_bytes = pdf.output(dest='S').encode('latin1')  # importante: latin1 por compatibilidad de caracteres
        pdf_output = io.BytesIO(pdf_bytes)
        pdf_output.seek(0)
        
        # Nombre del archivo con timestamp
        nombre_archivo = f"reporte_beneficiarias_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        
        return send_file(
            pdf_output,
            as_attachment=True,
            download_name=nombre_archivo,
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({"error": f"Error al generar el reporte: {str(e)}"}), 500