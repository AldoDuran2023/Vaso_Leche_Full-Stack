from flask import Flask, jsonify, Blueprint
from src.database.db import mysql

dashboard = Blueprint('dashboard', __name__)

@dashboard.route('/api/dashboard/<int:id_representante>', methods=['GET'])
def obtener_datos_dashboard(id_representante):
    cur = mysql.connection.cursor()

    # Ejecutar funciones MySQL
    cur.execute("SELECT contar_beneficiarias_activas()")
    total_beneficiarias = cur.fetchone()[0]

    cur.execute("SELECT contar_representantes_activos()")
    total_representantes = cur.fetchone()[0]

    cur.execute("SELECT balance_representante(%s)", (id_representante,))
    balance = float(cur.fetchone()[0])

    cur.execute("SELECT total_reuniones_por_representante(%s)", (id_representante,))
    total_reuniones = cur.fetchone()[0]

    cur.execute("SELECT contar_reparticiones_representante(%s)", (id_representante,))
    total_reparticiones = cur.fetchone()[0]

    cur.execute("SELECT total_gastos_representante(%s)", (id_representante,))
    total_gastos = float(cur.fetchone()[0])

    cur.execute("SELECT total_ingresos_representante(%s)", (id_representante,))
    total_ingresos = float(cur.fetchone()[0])


    cur.close()

    # Respuesta JSON
    return jsonify({
        "beneficiarias_activas": total_beneficiarias,
        "representantes_activos": total_representantes,
        "balance_tesoreria": balance,
        "reuniones": total_reuniones,
        "reparticiones": total_reparticiones,
        "gastos": total_gastos,
        "ingresos": total_ingresos
    })

